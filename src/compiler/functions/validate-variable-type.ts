export function validateVariableType (value: string) {
  switch(value) {
    case 'booleano':
    case 'inteiro':
    case 'real':
    case 'texto':
      return true
    default:
      return false
  }
}