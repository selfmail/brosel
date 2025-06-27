#!/usr/bin/env bun

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
			action: async (args) => {
				console.log("Starting development server with args:", args);
				// Here you would typically start your development server
				// For example, you might use a bundler like Vite or Webpack
			},
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
