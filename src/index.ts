import fs from "node:fs";
import path from "node:path";

import { compiler } from "./compiler/compiler";
import { interpreter } from "./compiler/interpreter";
import { raypilerTerminalCompiler } from "./raypiler/raypiler";

function main() {
  const args = process.argv;

  let haveReplFlag = false;
  let haveInterpreterFlag = false;
  let haveJavascriptFlag = false;
  // TODO: Funcionalidade do debug mode
  let debugMode = false;
  let pathToCode: string = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repl") {
      haveReplFlag = true;
    } else if (args[i] === "--out") {
      haveInterpreterFlag = true;
    } else if (args[i] === "--js") {
      haveJavascriptFlag = true;
      // TODO: fazer o --js tag, para retornar o JavaScript compilado
    }

    if (args[i] === "--debug") {
      debugMode = true;
    }

    pathToCode = args[i];
  }

  if (
    (haveReplFlag && haveInterpreterFlag) ||
    (haveReplFlag && haveJavascriptFlag) ||
    (haveInterpreterFlag && haveJavascriptFlag)
  ) {
    throw new Error("Não é possível ter mais de uma flag simultâneamente.");
  } else if (haveReplFlag) {
    // Recebendo sempre o código e compilando por meio do Raypiler
    console.clear();
    console.log("🔥 Raypiler v0.1");

    // Iniciando o Raypiler no Terminal
    raypilerTerminalCompiler(debugMode);
  } else if (haveInterpreterFlag) {
    console.clear();
    console.log(
      "Lendo arquivo no diretório " + path.join(__dirname, pathToCode) + " ..."
    );

    try {
      const data = fs.readFileSync(path.join(__dirname, pathToCode), "utf-8");

      console.log("Compilando código do arquivo...");
      const output = compiler(data, debugMode);

      console.log(
        "Escrevendo o código compilado no diretório " +
          path.join(__dirname, "output.js") +
          " ..."
      );
      try {
        fs.writeFileSync(path.join(__dirname, "output.js"), output, "utf-8");
        console.log("Arquivo salvo com sucesso!");
      } catch (err) {
        throw new Error("Error");
      }
    } catch (err) {
      throw new Error("Erro ao ler arquivo.");
    }
  } else if (haveJavascriptFlag) {
    console.clear();
    console.log("Lendo o arquivo Rayc...");
    const data = fs.readFileSync(path.join(__dirname, pathToCode), "utf-8");
    console.log("Arquivo lido!");

    console.log("Compilando código...");
    const output = compiler(data, debugMode);
    console.log("Resultado do compilador:\n");
    console.log(output);
  } else {
    const data = fs.readFileSync(path.join(__dirname, pathToCode), "utf-8");

    const output = compiler(data, debugMode);

    interpreter(output);
  }
}

main();
