// #!/usr/bin/env bun

import { createCli } from "../utils/cli";

const cli = await createCli({
	name: "Brösel CLI",
	description: "A CLI tool for Brösel",
	help: {
		command: "--help",
		answer:
			"This is a CLI tool for Brösel. Use `brosel <command> --help` to get more information about a specific command.",
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
