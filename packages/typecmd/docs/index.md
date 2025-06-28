**Welcome to typecmd**

Typecmd is a small (300 lines) typesafe cli arguments parser. You can specify your commands to run, and typecmd will parse the commands and runs the specified action for the command. You can also specify typesafe options, which will be parsed and given to the action as an argument.

*Examples*

A simple calculator:

```ts
await createCli({
    name: "calculator",
    description: "just a simple calculator",

    development: false,
    help: {
        // run `bun script.ts --help` to get the message locked
        command: "--help",
        answer: "Create a new calculation with the `calculate` command, and the option `--firstNumber <number>` and `--secondNumber <number>`"
    },

    commands: {
        calculate: {
            action: (args) => {
                console.log(`Calculation: ${args.firstNumber} + ${args.secondNumber} = ${args.firstNumber + args.secondNumber}`)
            },
            options: {
                firstNumber: {
                    type: "number",
                    name: "firstNumber",
                    required: true
                },
                secondNumber: {
                    type: "number",
                    name: "secondNumber",
                    required: true
                }
            }
        }
    }
})
```