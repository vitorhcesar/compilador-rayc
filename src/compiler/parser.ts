import { AdditiveOperator, BinaryExpressionNode, CallExpressionNode, IdentifierToken, Node, NumericLiteralNode, NumericLiteralToken, PlusToken, Program, Quotes, StringLiteralToken, StringNode, Token } from "../types/types";

export function parser (tokens: Token[]): Program {
  const program: Program = { body: [] }

  let current = 0

  function parse (): Node {
    const token = tokens[current]!

    // Identificadores
    if (token.type === 'Identifier') {
      return parseCallExpression(token)
    }
    
    // Literal Numérico
    if (token.type === 'NumericLiteral') {
      const next = tokens[current + 1]

      if (next?.type === 'PlusToken' || next?.type === 'MinusToken') {
        return parseBinaryExpression(token, next)
      } else {
        return parseNumericLiteral(token)
      }
    }

    // Aspas -> STRING
    if (token.type === 'DobleQuotesToken' || token.type === 'SingleQuotesToken') {
      const next = tokens[current + 1]
      const finalQuote = tokens[current + 2]
      const afterFinalQuote = tokens[current + 3]

      
      if (next.type === token.type) {
        if (afterFinalQuote.type === 'PlusToken') {
          // Se estivermos tratanto uma concatenação
          return parseStringConcatenation(token, '', afterFinalQuote)
        }

        return parseStringOnQuotes(token, '')
      } else if (next.type === 'StringLiteralToken' && finalQuote.type === token.type) {
        if (afterFinalQuote.type === 'PlusToken') {
          // Se estivermos tratanto uma concatenação
          return parseStringConcatenation(token, next, afterFinalQuote)
        }

        return parseStringOnQuotes(token, next)
      } else {
        throw new SyntaxError(`Erro ao passar String com ASPAS: ${token.type}, ${next.type}, ${finalQuote.type}`)
      }
    }

    throw new SyntaxError(`Token desconhecido: ${token.type}`)
  }

  function parseStringConcatenation(token: Quotes, value: string | StringLiteralToken, operator: PlusToken): BinaryExpressionNode {
    const left = parseStringOnQuotes(token, value)
    
    current++
    const right = parse()

    return { type: 'BinaryExpression', left, operator, right }
  }

  function parseBinaryExpression (token: NumericLiteralToken, next: AdditiveOperator): BinaryExpressionNode {
    const left = parseNumericLiteral(token)

    const operator = next
    current++

    const right = parse()
    return { type: 'BinaryExpression', left, operator, right }
  }

  function parseCallExpression (token: IdentifierToken): CallExpressionNode {
    const identifier = token
    current++

    if (tokens[current]?.type !== 'OpenParenToken') {
      throw new SyntaxError(`Identificador deve ser seguido de (, token recebido: ${tokens[current].type}`)
    }
    current++

    const argument: Node = parse()

    if (tokens[current]?.type !== 'CloseParenToken') {
      throw new SyntaxError(`Identificador deve terminar com ), token recebido: ${tokens[current].type}`)
    }
    current++

    return { type: 'CallExpression', identifier, argument }
  }

  function parseNumericLiteral (token: NumericLiteralToken): NumericLiteralNode {
    current++
    return { type: 'NumericLiteral', value: token.value }
  }

  function parseStringOnQuotes (token: Quotes, value: string | StringLiteralToken): StringNode {
    let Quote: Quotes = {
      type: 'DobleQuotesToken'
      // Por padrão o Quote será de DobleQuotesToken 
    }

    // Caso o token seja Single, trocar para single
    if (token.type === 'SingleQuotesToken') {
      Quote = { type: 'SingleQuotesToken' }
    }

    // Fazendo três incrementos por estar cuidando de dois tokens ao mesmo tempo na função.
    current++ // Passando o Primeiro Quote
    current++ // Passando o StringLiteral
    current++ // Passando o Final Quote

    if (typeof value === 'string') {
      return { type: 'String', value: value, Quote }
    } else {
      return { type: 'String', value: value.value, Quote }
    }
  }

  while (current < tokens.length) {
    program.body.push(parse())
  }

  return program
}