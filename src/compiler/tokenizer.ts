import { Token, VariableKinds } from "../types/types";
import { validateVariableType } from "./functions/validate-variable-type";

export function tokenizer(input: string): Token[] {
   const tokens: Token[] = []

   let cursorPos = 0
   while (cursorPos < input.length) {
      let char = input[cursorPos]

      // Espaço em branco
      if (/\s/.test(char)) {
         cursorPos++
         continue
      }

      // Parenteses
      if (char === '(') {
         tokens.push({ type: 'OpenParenToken' })
         cursorPos++
         continue
      }

      if (char === ')') {
         tokens.push({ type: 'CloseParenToken' })
         cursorPos++
         continue
      }

      // Aspas
      if (char === '"') {
         // tokens.push({ type: 'DobleQuotesToken' })
         cursorPos++

         // Validando o que estiver dentro das aspas duplas
         let value = ''
         while (input[cursorPos] !== '"') {
            value += input[cursorPos]
            cursorPos++
         }

         tokens.push({ type: 'StringLiteralToken', value })
         // tokens.push({ type: 'DobleQuotesToken' })

         cursorPos++

         continue
      }

      if (char === "'") {
         // TODO: Tirar os QUOTES para poder ter acesso direto ao StringLiteral
         // tokens.push({ type: 'SingleQuotesToken' })
         cursorPos++

         // Validando o que estiver dentro das aspas simples
         let value = ''
         while (input[cursorPos] !== "'") {
            value += input[cursorPos]
            cursorPos++
         }

         tokens.push({ type: 'StringLiteralToken', value })
         // tokens.push({ type: 'SingleQuotesToken' })

         cursorPos++

         continue
      }

      // Operadores
      if (char === '+') {
         tokens.push({ type: 'PlusToken' })
         cursorPos++
         continue
      }

      if (char === '-') {
         tokens.push({ type: 'MinusToken' })
         cursorPos++
         continue
      }

      // Igual -> '='
      if (char === '=') {
         tokens.push({ type: 'EqualsToken', value: char })
         cursorPos++
         continue
      }

      // Checando números
      const NUMBERS = /[0-9]/
      if (NUMBERS.test(char)) {
         let value = ''

         while (NUMBERS.test(char)) {
            value += char
            char = input[++cursorPos]!
         }

         tokens.push({ type: 'NumericLiteral', value })
         continue
      }

      // Checando letras
      const LETTERS = /[a-z]/i
      if (LETTERS.test(char)) {
         let value = ''

         while (LETTERS.test(char)) {
            value += char
            char = input[++cursorPos]!

            // Checando se o próximo valor é indefinido
            if (input[cursorPos] === undefined) {
               break
            }
         }

         // Variável
         if (value === 'variavel') {
            tokens.push({ type: 'VariableToken', constant: false })
            continue
         }
         // Constante
         if (value === 'constante') {
            tokens.push({ type: 'VariableToken', constant: true })
            continue
         }

         // Tipo de variável
         if (validateVariableType(value)) {
            tokens.push({ type: 'VariableTypeToken', value: value as VariableKinds })
            continue
         }

         // Caso seja um identificador
         tokens.push({ type: 'Identifier', value })
         continue
      }

      throw new SyntaxError(`ERROR: Token não esperado: "${char}"`)
   }

   return tokens
}