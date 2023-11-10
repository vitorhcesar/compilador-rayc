import { BinaryExpressionNode, CallExpressionNode, Node, NumericLiteralNode, Program, StringNode } from "../types/types";

export function emitter (program: Program): string {
  const output: string[] = []

  function emit (node: Node): string {
    switch (node.type) {
      case 'NumericLiteral':
        return emitNumericLiteral(node)
      case 'BinaryExpression':
        return emitBinaryExpression(node)
      case 'CallExpression':
        return emitCallExpression(node)
      case 'String':
        return emitString(node)
      default:
        throw new SyntaxError(`Node desconhecido: ${node}`)
    }
  }

  function emitNumericLiteral (node: NumericLiteralNode) {
    return node.value
  }

  function emitBinaryExpression (node: BinaryExpressionNode) {
    return `${emit(node.left)} ${node.operator.type === 'PlusToken' ? '+' : '-'} ${emit(node.right)}`
  }

  function emitCallExpression (node: CallExpressionNode) {
    if (node.identifier.value === 'imprima') {
      return `console.log(${emit(node.argument)})`
    } else {
      throw new Error(`Identificador desconhecido na expressão: ${node.identifier}`)
    }
  }

  function emitString(node: StringNode) {
    if (node.Quote.type === 'DobleQuotesToken') {
      return `"${node.value}"`
    } else if (node.Quote.type === 'SingleQuotesToken') {
      return `'${node.value}'`
    } else {
      throw new Error(`Erro ao passar String para Javascript: ${node.Quote}, ${node.value}`)
    }
  }

  for (const node of program.body) {
    output.push(emit(node))
  }
  
  return output.join('\n')
}