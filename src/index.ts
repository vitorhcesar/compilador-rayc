import fs from 'node:fs'
import path from 'node:path'
// import chalk from 'chalk'

import { raypilerTerminalCompiler } from './raypiler/raypiler'
import { compiler } from './compiler/compiler'
import { interpreter } from './compiler/interpreter'

const args = process.argv

let haveRunFlag = false
let haveInterpreterFlag = false
let pathToCode: string = ''

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--run') {
    haveRunFlag = true
  } else if (args[i] === '--interpret') {
    haveInterpreterFlag = true
  }

  pathToCode = args[i]
}

if (haveRunFlag && haveInterpreterFlag) {
  throw new Error('Não é possível ter o comando --interpret e --run simultâneamente.')
} else if (haveRunFlag) {
  // Recebendo sempre o código e compilando por meio do Raypiler
  console.clear()
  console.log('🔥 Raypiler v0.1')
  // Iniciando o Raypiler no Terminal
  raypilerTerminalCompiler()
} else if (haveInterpreterFlag) {
  console.clear()
  console.log('Lendo arquivo no diretório ' + path.join(__dirname, pathToCode) + ' ...')

  try {
    const data = fs.readFileSync(path.join(__dirname, pathToCode), 'utf-8')
    
    console.log('Compilando código do arquivo...')
    const output = compiler(data)
  
    console.log('Escrevendo o código compilado no diretório ' + path.join(__dirname, 'output.js') + ' ...')
    try {
      fs.writeFileSync(path.join(__dirname, 'output.js'), output, 'utf-8')
      console.log('Arquivo salvo com sucesso!')
    } catch (err) {
      throw new Error('Error')
    }
  } catch (err) {
    throw new Error('Erro ao ler arquivo.')
  }
} else {
  const data = fs.readFileSync(path.join(__dirname, pathToCode), 'utf-8')

  const output = compiler(data)

  interpreter(output)
}
