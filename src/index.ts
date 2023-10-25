import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

import { raypilerTerminalCompiler } from './raypiler/raypiler'
import { compiler } from './compiler/compiler'

const args = process.argv
let haveRunFlag = false
let input: string = ''
let pathToCode: string = ''

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--run') {
    haveRunFlag = true
  }

  pathToCode = args[i]
}

if (haveRunFlag) {
  // Recebendo sempre o código e compilando por meio do Raypiler
  console.clear()
  // console.log(chalk.yellow('🔥 Raypiler v0.1'))
  console.log('🔥 Raypiler v0.1')
  raypilerTerminalCompiler()
} else {
  const data = fs.readFileSync(path.join(__dirname, pathToCode), 'utf-8')

  console.log(data)
}
