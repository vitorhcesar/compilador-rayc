import { AdditiveOperator, BinaryExpressionNode, CallExpressionNode, IdentifierToken, Node, NumericLiteralNode, NumericLiteralToken, PlusToken, Program, StringLiteralToken, StringNode, Token, VariableCallNode, VariableNode, VariableTypeToken } from "../types/types";

export function parser(tokens: Token[]): Program {
   const program: Program = { body: [] }

   const variables: Array<string> = []
   const constants: Array<string> = []
   const nativeFunctions: Array<string> = [
      'imprima',
      'se',
      'senao',
      'leia',
   ]
   const functions: Array<Array<string>> = []

   function checkVariables(value: string): boolean {
      for (let i = 0; i < variables.length; i++) {
         if (value === variables[i]) {
            return true
         }
      }

      return false
   }

   function checkConstants(value: string): boolean {
      for (let i = 0; i < constants.length; i++) {
         if (value === constants[i]) {
            return true
         }
      }

      return false
   }

   function checkNativeFunctions(value: string): boolean {
      for (let i = 0; i < nativeFunctions.length; i++) {
         if (value === nativeFunctions[i]) {
            return true
         }
      }

      return false
   }

   let current = 0

   function parse(): Node {
      const token = tokens[current]!

      // Variável
      if (token.type === 'VariableToken') {
         const variableType = tokens[current + 1]
         const variableName = tokens[current + 2]
         const equals = tokens[current + 3]
         const variableValue = tokens[current + 4]

         // Verificando se é constante ou não
         const constantValue = token.constant

         // console.log(`Achei o token de VariableToken, 1 ${variableType.type}, 2 ${variableName.type}, 3 ${equals.type}, 4 ${variableValue.type}`)
         // console.log(`Achei o token de VariableToken, 1 ${variableType}, 2 ${variableName}, 3 ${equals}, 4 ${variableValue}`)

         // Caso algum dos valores importantes seja nulo ou indefinido
         if (variableType === undefined || variableName === undefined) {
            throw new SyntaxError(`O nome da variável ou o tipo precisam ser definidos! ${token}`)
         }

         // Se o valor do Equals for indefinido ou nulo 
         if (equals === undefined) {
            if (variableType.type === 'VariableTypeToken' && variableName.type === 'Identifier') {
               if (constantValue === true) {
                  throw new SyntaxError(`A constante precisa ser inicializada! ${variableType} ${variableName} ${constantValue}`)
               }
               console.log('Cheguei aqui')

               return parseVariable(variableType, variableName, undefined, constantValue)
            }
         }

         if (variableType.type === 'VariableTypeToken') {
            if (variableName.type === 'Identifier') {
               if (equals.type === 'EqualsToken') {
                  if (variableValue.type === 'NumericLiteral' || variableValue.type === 'StringLiteralToken') {
                     return parseVariable(variableType, variableName, variableValue, constantValue)
                  }
               } else {
                  // Se o 'equals' não for do tipo equals

                  // Se a variável for constante soltar um erro
                  if (constantValue === true) {
                     throw new SyntaxError(`A constante precisa ser iniciada, ${variableType} ${variableName} ${constantValue}`)
                  }

                  return parseVariable(variableType, variableName, undefined, constantValue)
               }
            }
         }

         throw new SyntaxError(`Erro ao passar Variável: ${token.type}, ${variableType}, ${variableName}, ${equals}, ${variableValue}`)
      }

      // Identificadores
      if (token.type === 'Identifier') {
         const next = tokens[current + 1]

         // Caso o Identificador seja uma variável
         if (checkVariables(token.value)) {
            if (next.type === 'PlusToken') {
               const variableCall = parseVariableCall(token)

               return parseBinaryExpressionAny(variableCall, next)
            }

            return parseVariableCall(token)
         }

         // Caso o Identificador seja uma constante
         if (checkConstants(token.value)) {
            if (next.type === 'PlusToken') {
               const variableCall = parseVariableCall(token)

               return parseBinaryExpressionAny(variableCall, next)
            }

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

   function parseVariable(type: VariableTypeToken, name: IdentifierToken, value: undefined | NumericLiteralToken | StringLiteralToken, constant: boolean): VariableNode {
      // Checando existência do nome da variavél
      if (checkVariables(name.value)) {
         throw new SyntaxError(`Essa variável já existe! ${type.type}, ${value}`)
      }

      // Checando existência como constante
      if (checkConstants(name.value)) {
         throw new SyntaxError(`Essa variável já existe como constante! ${type.type}, ${value}`)
      }

      // TODO: Checar se a variável tem o nome de uma função nativa ou função criada
      if (checkNativeFunctions(name.value)) {
         throw new SyntaxError(`Essa variável já existe como função nativa! ${type.type}, ${value}`)
      }

      if (constant === true) {
         constants.push(name.value)
      } else {
         variables.push(name.value)
      }

      if (value === undefined) {
         current = current + 3

         return { type: 'Variable', kind: type.value, name: name.value, value: undefined, constant }
      }

      if (value.type === 'StringLiteralToken' && type.value === 'texto') {
         current = current + 5

         return { type: 'Variable', kind: type.value, name: name.value, value: value.value, constant }
      }

      if (value.type === 'NumericLiteral' && type.value === 'inteiro') {
         current = current + 5
         return { type: 'Variable', kind: type.value, name: name.value, value: value.value, constant }
      }

      throw new SyntaxError(`Erro fazendo o parseamento da Variável: ${type.type}, ${value.type}`)
   }

   function parseVariableCall(token: IdentifierToken): VariableCallNode {
      current++
      return { type: 'VariableCall', value: token.value }
   }

   function parseStringOnQuotes(token: StringLiteralToken): StringNode {
      current++
      return { type: 'String', value: token.value }
   }

   function parseStringConcatenation(token: StringLiteralToken, operator: PlusToken): BinaryExpressionNode {
      const left = parseStringOnQuotes(token)

      current++
      const right: Node = parse()

      return { type: 'BinaryExpression', left, operator, right }
   }

   function parseBinaryExpressionAny(node: Node, next: AdditiveOperator): BinaryExpressionNode {
      const left = node

      const operator = next
      current++

      const right = parse()
      return { type: 'BinaryExpression', left, operator, right }
   }

   function parseBinaryExpression(token: NumericLiteralToken, next: AdditiveOperator): BinaryExpressionNode {
      const left = parseNumericLiteral(token)

      const operator = next
      current++

      const right = parse()
      return { type: 'BinaryExpression', left, operator, right }
   }

   function parseCallExpression(token: IdentifierToken): CallExpressionNode {
      const identifier = token
      current++

      if (tokens[current]?.type !== 'OpenParenToken') {
         throw new SyntaxError(`O identificador ${token.value} deve ser seguido de (, token recebido: ${tokens[current].type}`)
      }
      current++

      const argument: Node = parse()

      if (tokens[current]?.type !== 'CloseParenToken') {
         throw new SyntaxError(`O identificador ${token.value} deve terminar com ), token recebido: ${tokens[current].type}`)
      }
      current++

      return { type: 'CallExpression', identifier, argument }
   }

   function parseNumericLiteral(token: NumericLiteralToken): NumericLiteralNode {
      current++
      return { type: 'NumericLiteral', value: token.value }
   }

   while (current < tokens.length) {
      program.body.push(parse())
   }

   return program
}