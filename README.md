# Rayc 💜

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) ![Status](https://img.shields.io/badge/status-experimental-orange?style=for-the-badge) ![Licença](https://img.shields.io/github/license/vitorhcesar/compilador-rayc?style=for-the-badge)

**Rayc** é uma linguagem de programação com sintaxe em português. O nome é inspirado na minha esposa, **Rayssa**.

Este repositório contém o **compilador da Rayc**, escrito em TypeScript: ele lê código `.rayc`, transforma em JavaScript e executa o resultado.

```rayc
variavel texto nome = "Rayssa"
imprima("Olá, " + nome)
```

## Status

🚧 **Em desenvolvimento inicial (experimental).** A linguagem ainda é pequena: hoje ela suporta variáveis e constantes tipadas, textos, números, booleanos, soma/subtração, concatenação de textos e a função `imprima`. Não há (ainda) condicionais, laços, funções definidas pelo usuário nem testes automatizados.

## Requisitos e instalação

- [Bun](https://bun.sh) (usado pelo script `start`) **ou** Node.js com `ts-node` (script `dev`).

```bash
git clone https://github.com/vitorhcesar/compilador-rayc.git
cd compilador-rayc
bun install      # ou: npm install
```

Não há etapa de build: o TypeScript é executado diretamente.

## Como executar um arquivo `.rayc`

> ⚠️ O caminho do arquivo é resolvido **a partir da pasta `src/`** e precisa ser o **último argumento**.

```bash
# Compila e executa
bun run src/index.ts samples/basic.rayc

# Mostra o JavaScript gerado no terminal
bun run src/index.ts --js samples/basic.rayc

# Salva o JavaScript gerado em src/output.js
bun run src/index.ts --out samples/basic.rayc

# Abre o REPL (Raypiler); digite "exit" para sair
bun run src/index.ts --repl
```

Com Node.js, troque `bun run` por `npx ts-node`. A flag `--debug` mostra os tempos de cada etapa da compilação (tokenização, parseamento e emissão). As flags `--repl`, `--js` e `--out` não podem ser usadas juntas.

## Sintaxe

| Palavra/elemento | Significado | Exemplo |
|---|---|---|
| `variavel` | Declara uma variável (vira `let`) | `variavel numero idade = 22` |
| `constante` | Declara uma constante (vira `const`); precisa ser inicializada | `constante booleano humano = Verdadeiro` |
| `texto` | Tipo texto (string) | `variavel texto nome = "Vítor"` |
| `numero` | Tipo número (inteiros) | `variavel numero ano = 2024` |
| `booleano` | Tipo lógico | `constante booleano ativo = Falso` |
| `Verdadeiro` / `Falso` | Valores booleanos | `constante booleano ok = Verdadeiro` |
| `imprima(...)` | Mostra um valor no terminal (`console.log`) | `imprima("Olá")` |
| `"..."` ou `'...'` | Texto entre aspas duplas ou simples | `'Olá ' + nome` |
| `+` / `-` | Soma, subtração e concatenação de textos | `imprima(10 + 5 - 3)` |
| `=` | Atribuição a uma variável já declarada | `nome = 'Rayssa'` |

Regras atuais:

- O tipo declarado é verificado: uma variável `texto` só recebe texto e uma `numero` só recebe número.
- Não é possível declarar duas vezes o mesmo nome, nem reatribuir uma constante.
- Variáveis podem ser declaradas sem valor (`variavel numero x`) e receber um depois (`x = 5`).
- Nomes de variáveis aceitam apenas letras sem acento (`a-z`, `A-Z`); acentos são permitidos dentro dos textos.
- Os nomes `imprima`, `se`, `senao` e `leia` são reservados (apenas `imprima` está implementado).

## Exemplos

### Olá, mundo

```rayc
imprima("Olá, mundo!")
```

Saída:

```
Olá, mundo!
```

### Exemplo completo ([`src/samples/basic.rayc`](src/samples/basic.rayc))

```rayc
variavel texto nome = "Vítor"
variavel numero idade = 22
constante booleano humano = Verdadeiro

imprima("Olá " + nome)
imprima(567-985+54376-4376)
imprima('Olá ' + nome + ', você tem ' + idade + ' anos de idade!')

nome = 'Rayssa'
imprima('Variavel nome após a modificação '+ nome)
imprima(humano)
```

Saída:

```
Olá Vítor
49582
Olá Vítor, você tem 22 anos de idade!
Variavel nome após a modificação Rayssa
true
```

JavaScript gerado (`--js`):

```js
let nome = 'Vítor'
let idade = 22
const humano = true
console.log('Olá ' + nome)
console.log(567 - 985 + 54376 - 4376)
console.log('Olá ' + nome + ', você tem ' + idade + ' anos de idade!')
nome = 'Rayssa'
console.log('Variavel nome após a modificação ' + nome)
console.log(humano)
```

## Como o compilador funciona

```
código .rayc → Tokenizer → Parser (AST) → Emitter (JavaScript) → Interpreter (eval)
```

1. **Tokenizer** (`src/compiler/tokenizer.ts`): percorre o código caractere a caractere e gera tokens (palavras-chave, tipos, identificadores, números, textos, booleanos, `+`, `-`, `=`, parênteses).
2. **Parser** (`src/compiler/parser.ts`): transforma os tokens em uma árvore sintática (AST), registrando variáveis e constantes e validando tipos e nomes repetidos.
3. **Emitter** (`src/compiler/emitter.ts`): converte a AST em código JavaScript.
4. **Interpreter** (`src/compiler/interpreter.ts`): executa o JavaScript gerado com `eval`.

O arquivo `src/compiler/compiler.ts` encadeia as três primeiras etapas, e `src/index.ts` é a linha de comando.

## Estrutura do projeto

```
src/
├── index.ts                  # CLI: flags --repl, --js, --out, --debug
├── compiler/
│   ├── compiler.ts           # Orquestra tokenizer → parser → emitter
│   ├── tokenizer.ts          # Análise léxica
│   ├── parser.ts             # Análise sintática (AST)
│   ├── emitter.ts            # Geração de JavaScript
│   ├── interpreter.ts        # Execução do código gerado
│   └── functions/
│       └── validate-variable-type.ts
├── repl/
│   └── raypiler.ts           # REPL interativo (Raypiler)
├── samples/
│   └── basic.rayc            # Exemplo da linguagem
└── types/                    # Tipos de tokens e nós da AST
```

## Próximos passos

Baseado nos `TODO`s e nomes reservados no código:

- [ ] Condicionais `se` / `senao`
- [ ] Leitura de entrada com `leia`
- [ ] Funções definidas pelo usuário
- [ ] Modo `--debug` mais completo

## Autor

Feito com 💜 por **Vítor H. Cesar**, Desenvolvedor Full Stack, em homenagem à Rayssa.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vitorhcesar/) [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vitorhcesar)
