import { emitter } from "./emitter";
import { parser } from "./parser";
import { tokenizer } from "./tokenizer";

export function compiler(input: string): string {
   // Transformando a string do código em um Array de Tokens
   const tokens = tokenizer(input)
   // Transformando o Array de Tokens em um AST
   const ast = parser(tokens)
   // Transformando o AST em código JavaScript
   const output = emitter(ast)

   return output
}