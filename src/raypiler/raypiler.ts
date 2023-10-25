import * as readline from 'readline'

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
      console.log('\nYour code: ', code)
    }
  }

  console.log('\n🪚 Exited from Raypiler.')
}