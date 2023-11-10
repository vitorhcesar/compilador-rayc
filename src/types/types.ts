export type IdentifierToken = { type: 'Identifier', value: string }
export type OpenParenToken = { type: 'OpenParenToken' }
export type CloseParenToken = { type: 'CloseParenToken' }
export type DobleQuotesToken = { type: 'DobleQuotesToken' }
export type SingleQuotesToken = { type: 'SingleQuotesToken' }
export type StringLiteralToken = { type: 'StringLiteralToken', value: string }
export type NumericLiteralToken = { type: 'NumericLiteral', value: string }
export type PlusToken = { type: 'PlusToken' }
export type MinusToken = { type: 'MinusToken' }

export type Token =
 | IdentifierToken
 | OpenParenToken
 | CloseParenToken
 | NumericLiteralToken
 | PlusToken
 | MinusToken
 | DobleQuotesToken
 | SingleQuotesToken
 | StringLiteralToken

export type AdditiveOperator = PlusToken | MinusToken
export type Quotes = DobleQuotesToken | SingleQuotesToken

export type NumericLiteralNode = { type: 'NumericLiteral', value: string }
export type CallExpressionNode = { type: 'CallExpression', identifier: IdentifierToken, argument: Node }
export type BinaryExpressionNode = { type: 'BinaryExpression', left: Node, right: Node, operator: AdditiveOperator }
export type StringNode = { type: 'String', Quote: Quotes, value: string }

export type Node =
  | NumericLiteralNode
  | CallExpressionNode
  | BinaryExpressionNode
  | StringNode

export type Program = {
  body: Node[]
}