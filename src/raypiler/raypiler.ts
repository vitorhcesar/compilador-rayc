import * as readline from 'readline'
import { compiler } from '../compiler/compiler'
import { interpreter } from '../compiler/interpreter'

export const raypiler = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const getValueFromTerminal = () => {
  return new Promise<string>((resolve) => {
    raypiler.question('> ', (code: string) => {
      resolve(code)
    })
  })
}

export const raypilerTerminalCompiler = async () => {
  let willContinue = true
  while (willContinue) {
    const code = await getValueFromTerminal()

    if (code === 'exit') {
      raypiler.close()
      willContinue = false
    } else {
      const output = compiler(code)
      
      console.log('\nYour code: ', code)
      console.log('Your JavaScript converted code: ', output)
      console.log('\nInterpreting the code...')

      interpreter(output)
    }
  }

  console.log('\n🪚 Exited from Raypiler.')
}