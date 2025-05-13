import { emitter } from "./emitter";
import { parser } from "./parser";
import { tokenizer } from "./tokenizer";

export function compiler(input: string, debugMode: boolean = false): string {
  if (debugMode) {
    console.time("tempo-de-compilacao");
  }

  if (debugMode) {
    console.time("tempo-de-tokenizacao");
  }
  // Transformando a string do código em um Array de Tokens
  const tokens = tokenizer(input);
  if (debugMode) {
    console.timeEnd("tempo-de-tokenizacao");
  }

  if (debugMode) {
    console.time("tempo-de-parseamento");
  }
  // Transformando o Array de Tokens em um AST
  const ast = parser(tokens);
  if (debugMode) {
    console.timeEnd("tempo-de-parseamento");
  }

  if (debugMode) {
    console.time("tempo-de-emitir");
  }
  // Transformando o AST em código JavaScript
  const output = emitter(ast);
  if (debugMode) {
    console.timeEnd("tempo-de-emitir");
  }

  if (debugMode) {
    console.timeEnd("tempo-de-compilacao");
  }

  return output;
}
