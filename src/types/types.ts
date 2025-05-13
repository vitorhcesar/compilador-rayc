export type IdentifierToken = { type: "Identifier"; value: string };
export type VariableToken = { type: "VariableToken"; constant: boolean };
export type VariableTypeToken = {
  type: "VariableTypeToken";
  value: VariableKinds;
};
export type EqualsToken = { type: "EqualsToken"; value: string };
export type OpenParenToken = { type: "OpenParenToken" };
export type CloseParenToken = { type: "CloseParenToken" };
export type DobleQuotesToken = { type: "DobleQuotesToken" };
export type SingleQuotesToken = { type: "SingleQuotesToken" };
export type StringLiteralToken = { type: "StringLiteralToken"; value: string };
export type NumericLiteralToken = { type: "NumericLiteral"; value: string };
export type BooleanLiteralToken = { type: "BooleanLiteral"; value: boolean };
export type PlusToken = { type: "PlusToken" };
export type MinusToken = { type: "MinusToken" };

export type Token =
  | IdentifierToken
  | OpenParenToken
  | CloseParenToken
  | PlusToken
  | MinusToken
  | DobleQuotesToken
  | SingleQuotesToken
  | StringLiteralToken
  | NumericLiteralToken
  | BooleanLiteralToken
  | VariableToken
  | VariableTypeToken
  | EqualsToken;

export type AdditiveOperator = PlusToken | MinusToken;
export type Quotes = DobleQuotesToken | SingleQuotesToken;

export type VariableKinds = "booleano" | "texto" | "numero";

export type NumericLiteralNode = { type: "NumericLiteral"; value: string };
export type CallExpressionNode = {
  type: "CallExpression";
  identifier: IdentifierToken;
  argument: Node;
};
export type BinaryExpressionNode = {
  type: "BinaryExpression";
  left: Node;
  right: Node;
  operator: AdditiveOperator;
};
export type StringNode = { type: "String"; value: string };
export type VariableNode = {
  type: "Variable";
  kind: VariableKinds;
  name: string;
  value: string | undefined;
  constant: boolean;
};
export type VariableCallNode = { type: "VariableCall"; value: string };
export type VariableAtributtionNode = {
  type: "VariableAtributtion";
  value: string;
  name: string;
  kind: VariableKinds;
};

export type Node =
  | NumericLiteralNode
  | CallExpressionNode
  | BinaryExpressionNode
  | StringNode
  | VariableNode
  | VariableCallNode
  | VariableAtributtionNode;

export type Program = {
  body: Node[];
};
