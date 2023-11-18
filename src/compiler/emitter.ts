import { BinaryExpressionNode, CallExpressionNode, Node, NumericLiteralNode, Program, StringNode, VariableAtributtionNode, VariableCallNode, VariableNode } from "../types/types";

export function emitter(program: Program): string {
   const output: string[] = []

   function emit(node: Node): string {
      switch (node.type) {
         case 'NumericLiteral':
            return emitNumericLiteral(node)
         case 'BinaryExpression':
            return emitBinaryExpression(node)
         case 'CallExpression':
            return emitCallExpression(node)
         case 'String':
            return emitString(node)
         case 'Variable':
            return emitVariable(node)
         case 'VariableCall':
            return emitVariableCall(node)
         case 'VariableAtributtion':
            return emitVariableAtributtion(node)
         default:
            throw new SyntaxError(`Node desconhecido: ${node}`)
      }
   }

   function emitNumericLiteral(node: NumericLiteralNode) {
      return node.value
   }

   function emitBinaryExpression(node: BinaryExpressionNode) {
      return `${emit(node.left)} ${node.operator.type === 'PlusToken' ? '+' : '-'} ${emit(node.right)}`
   }

   function emitCallExpression(node: CallExpressionNode) {
      if (node.identifier.value === 'imprima') {
         return `console.log(${emit(node.argument)})`
      } else {
         throw new Error(`Identificador desconhecido na expressão: ${node.identifier}`)
      }
   }

   function emitString(node: StringNode) {
      return `'${node.value}'`
   }

   function emitVariable(node: VariableNode) {
      const variableName = node.constant ? 'const' : 'let'

      if (node.value === undefined) {
         return `${variableName} ${node.name}`
      } else {
         if (node.kind === 'texto') {
            return `${variableName} ${node.name} = '${node.value}'`
         }

         // Booleano, inteiro, real
         return `${variableName} ${node.name} = ${node.value}`
      }
   }

   function emitVariableCall(node: VariableCallNode) {
      return `${node.value}`
   }

   function emitVariableAtributtion(node: VariableAtributtionNode) {
      if (node.kind === 'texto') {
         return `${node.name} = '${node.value}'`
      }

      // Inteiro, booleano
      return `${node.name} = ${node.value}`
   }

   for (const node of program.body) {
      output.push(emit(node))
   }

   return output.join('\n')
}