import { Token } from "../types/types";

export function tokenizer (input: string): Token[] {
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
      tokens.push({ type: 'DobleQuotesToken' })
      cursorPos++

      // Validando o que estiver dentro das aspas duplas
      let value = ''
      while (input[cursorPos] !== '"') {
        value += input[cursorPos]
        cursorPos++
      }

      tokens.push({ type: 'StringLiteralToken', value })
      tokens.push({ type: 'DobleQuotesToken' })

      cursorPos++

      continue
    }

    if (char === "'") {
      tokens.push({ type: 'SingleQuotesToken' })
      cursorPos++

      // Validando o que estiver dentro das aspas simples
      let value = ''
      while (input[cursorPos] !== "'") {
        value += input[cursorPos]
        cursorPos++
      }

      tokens.push({ type: 'StringLiteralToken', value })
      tokens.push({ type: 'SingleQuotesToken' })

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
      }

      tokens.push({ type: 'Identifier', value })
      continue
    }

    throw new SyntaxError(`ERROR: Token não esperado: "${char}"`)
  }

  return tokens
}