// #!/usr/bin/env bun

import chalk from "chalk";
import { createCli } from "../utils/cli";

export const cli = await createCli({
	name: "Brösel CLI",
	description: "The official CLI tool for the Brösel web framework.",
	help: {
		command: "--help",
		answer: `
${chalk.gray("Brösel Help")}

Brösel is a modern web framework for building fast websites fast. It's using bun's serve() under the hood and is completely type safe.

Available commands:
  ${chalk.blue("dev")} - Start the development server inside the current directory (must be the root of a Brösel project).
  ${chalk.blue("build")} - Build the current project for production.
  ${chalk.blue("deploy")} - ${chalk.gray("Coming soon!")}
  ${chalk.blue("--help")} - Show this help message.
`,
	},
	commands: {
		dev: {
			action: async (args) => {},
			options: {
				port: {
					type: "number",
					required: true,
					name: "port",
				},
				host: {
					type: "string",
					required: false,
					name: "host",
				},
			},
		},
	},
});
