import { AdditiveOperator, BinaryExpressionNode, CallExpressionNode, IdentifierToken, Node, NumericLiteralNode, NumericLiteralToken, PlusToken, Program, StringLiteralToken, StringNode, Token, VariableCallNode, VariableNode, VariableTypeToken } from "../types/types";

export function parser (tokens: Token[]): Program {
  const program: Program = { body: [] }

  const variables: Array<string> = []
  const constants: Array<string> = []
  const functions: Array<Array<string>> = []

  function checkVariables (value: string): boolean {
    for (let i = 0; i < variables.length; i++) {
      if (value === variables[i]) {
        return true
      }
    }

    return false
  }

  function checkConstants (value: string): boolean {
    for (let i = 0; i < constants.length; i++) {
      if (value === constants[i]) {
        return true
      }
    }

    return false
  }

  let current = 0

  function parse (): Node {
    const token = tokens[current]!

    // Variável
    if (token.type === 'VariableToken') {
      const variableType = tokens[current + 1]
      const variableName = tokens[current + 2]
      const equals = tokens[current + 3]
      const variableValue = tokens[current + 4]

      // console.log(`Achei o token de VariableToken, 1 ${variableType.type}, 2 ${variableName.type}, 3 ${equals.type}, 4 ${variableValue.type}`)

      if (variableType.type === 'VariableTypeToken') {
        if (variableName.type === 'Identifier') {
          if (equals.type === 'EqualsToken') {
            if (variableValue.type === 'NumericLiteral' || variableValue.type === 'StringLiteralToken') {
              return parseVariable(variableType, variableName, variableValue)
            }
          } else {
            return parseVariable(variableType, variableName, undefined)
          }
        }
      }

      throw new SyntaxError(`Erro ao passar Variável: ${token.type}, ${variableType}, ${variableName}, ${equals}, ${variableValue}`)
    }

    // Identificadores
    if (token.type === 'Identifier') {
      if (checkVariables(token.value)) {
        return parseVariableCall(token)
      }

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

    // Aspas -> STRING: Tirado as aspas e fazendo apenas parseamento da STRING
    if (token.type === 'StringLiteralToken') {
      const next = tokens[current + 1]

      if (next.type === 'PlusToken') {
        return parseStringConcatenation(token, next)
      }

      return parseStringOnQuotes(token)
    }

    throw new SyntaxError(`Token desconhecido: ${token.type}`)
  }

  function parseVariable (type: VariableTypeToken, name: IdentifierToken, value: undefined | NumericLiteralToken | StringLiteralToken): VariableNode {
    // Checando existência do nome da variavél
    if (checkVariables(name.value)) {
      throw new SyntaxError(`Essa variável já existe! ${type.type}, ${value}`)
    }

    // Checando existência como constante
    if (checkConstants(name.value)) {
      throw new SyntaxError(`Essa variável já existe como constante! ${type.type}, ${value}`)
    }

    // TODO: Checar se a variável tem o nome de uma função nativa ou função criada

    variables.push(name.value)
    
    if (value === undefined) {
      current = current + 3

      return { type: 'Variable', kind: type.value, name: name.value, value: undefined }
    }

    if (value.type === 'StringLiteralToken' && type.value === 'texto') {
      current = current + 5

      return { type: 'Variable', kind: type.value, name: name.value, value: value.value }
    }

    if (value.type === 'NumericLiteral' && type.value === 'inteiro') {
      current = current + 5
      return { type: 'Variable', kind: type.value, name: name.value, value: value.value }
    }

    throw new SyntaxError(`Erro fazendo o parseamento da Variável: ${type.type}, ${value.type}`)
  }

  function parseVariableCall (token: IdentifierToken): VariableCallNode {
    current++
    return { type: 'VariableCall', value: token.value }
  }

  function parseStringOnQuotes (token: StringLiteralToken): StringNode {
    current++
    return { type: 'String', value: token.value }
  }

  function parseStringConcatenation(token: StringLiteralToken, operator: PlusToken): BinaryExpressionNode {
    const left = parseStringOnQuotes(token)
    
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

  while (current < tokens.length) {
    program.body.push(parse())
  }

  return program
}