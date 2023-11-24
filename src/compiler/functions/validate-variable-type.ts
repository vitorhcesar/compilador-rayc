export function validateVariableType(value: string) {
   switch (value) {
      case 'booleano':
      case 'numero':
      case 'texto':
         return true
      default:
         return false
   }
}