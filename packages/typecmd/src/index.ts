// Copyright (c) 2025 Selfmail
/// <reference types="bun" />
type OptionType = "string" | "number" | "boolean" | "array";

export type Option = {
	type: OptionType;
	required: boolean;
	name: string;
};

type InferOptionValue<T extends Option> = T["type"] extends "string"
	? string
	: T["type"] extends "number"
		? number
		: T["type"] extends "boolean"
			? boolean
			: T["type"] extends "array"
				? unknown[]
				: never;

type InferArgs<T extends Record<string, Option>> = {
	[K in keyof T as T[K]["required"] extends true ? K : never]: InferOptionValue<
		T[K]
	>;
} & {
	[K in keyof T as T[K]["required"] extends true
		? never
		: K]?: InferOptionValue<T[K]>;
};

export type CLIConfig<
	T extends {
		[key: string]: Record<string, Option>;
	},
> = {
	commands: {
		[K in keyof T]: {
			action: (
				args: InferArgs<T[K]>,
				meta: {
					name: string;
					description: string;
					command: string;
				},
			) => void | Promise<void>;
			options: T[K];
		};
	};
	name: string;
	/**
	 * Development flag to enable development mode. Once enabled, the cli will log helpful
	 * debug information to the console.
	 */
	development?: boolean;
	/**
	 * You can provide a help command with the avaiable commands and a description.
	 */
	help?: {
		/**
		 * The command to execute to get help.
		 *
		 * For example:
		 *
		 * `help` => `bun cli.ts help`
		 *
		 * or
		 *
		 * `--help` => `bun cli.ts --help`
		 */
		command: string;
		/**
		 * The answer for the help command. This has to be a string which get's returned.
		 * You can add colors to the string with libraries like `chalk`.
		 */
		answer: string;
	};
	description: string;
};

/**
 * Create a new CLI with parsing of commands and options. This cli implementation is completely type safe.
 * You can define commands with the first parameter of the function.
 *
 *  @example
 * ```ts
 * // run `bun run cli.ts start --port <number>` for a successfull result
 * await createCli({
 *   name: "my-cli",
 *   description: "A CLI tool for my application",
 *   help: {
 *     command: "--help",
 *     answer: "This is a CLI tool for my application",
 *   },
 *   commands: {
 *     start: {
 *       action: (args) => {
 *         console.log("Starting with args:", args);
 *       },
 *       options: {
 *         port: {
 *           type: "number",
 *           required: true,
 *            name: "port",
 *         },
 *         host: {
 *           type: "string",
 *           required: false,
 *           name: "host",
 *         },
 *       },
 *     },
 * });
 * ```
 */
export async function createCli<
	T extends {
		[key: string]: Record<string, Option>;
	},
>({
	commands,
	name,
	description,
	help,
	development = false,
}: CLIConfig<T>): Promise<
	// return type if everything goes well, then we return the given parameters
	| {
			command: string;
			options: Record<string | symbol, string | number | string[] | boolean>;
	  }
	| undefined
> {
	const scriptArguments = process.argv.slice(2);
	if (development)
		console.log("🔍 [CLI Debug] Script arguments:", scriptArguments);

	const command = scriptArguments.join(" ");

	// check if this is the help script
	if (command === help?.command) {
		if (development) console.log("ℹ️ [CLI Debug] Help command detected");
		console.log(help.answer);
		return;
	}

	// Parse command and arguments
	const commandName = scriptArguments[0];
	const args = scriptArguments.slice(1);
	if (development) console.log("📝 [CLI Debug] Command name:", commandName);
	if (development) console.log("📝 [CLI Debug] Raw args:", args);

	// Check if command exists
	if (!commandName || !commands[commandName]) {
		if (development) console.log("❌ [CLI Debug] Command validation failed");
		console.error(`Unknown command: ${commandName || "none"}`);
		console.error(`Available commands: ${Object.keys(commands).join(", ")}`);
		process.exit(1);
	}

	if (development) console.log("✅ [CLI Debug] Command found:", commandName);
	const commandConfig = commands[commandName];
	const options = commandConfig.options;
	if (development)
		console.log("📋 [CLI Debug] Command options:", Object.keys(options));

	// Parse arguments into key-value pairs
	const parsedArgs: Record<string, unknown> = {};
	const errors: string[] = [];
	if (development) console.log("🔄 [CLI Debug] Starting argument parsing...");

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg) continue;

		if (arg.startsWith("--")) {
			const key = arg.slice(2);
			if (development)
				console.log(`🔧 [CLI Debug] Processing option: --${key}`);
			const option = Object.values(options).find((opt) => opt.name === key);

			if (!option) {
				if (development)
					console.log(`⚠️ [CLI Debug] Unknown option detected: --${key}`);
				errors.push(`Unknown option: --${key}`);
				continue;
			}

			if (development)
				console.log(
					`✅ [CLI Debug] Option found: --${key}, type: ${option.type}`,
				);

			if (option.type === "boolean") {
				parsedArgs[key] = true;
				if (development)
					console.log(`✅ [CLI Debug] Set boolean option --${key} to true`);
			} else {
				const value = args[i + 1];
				if (!value || value.startsWith("--")) {
					if (development)
						console.log(`❌ [CLI Debug] Missing value for option --${key}`);
					errors.push(`Option --${key} requires a value`);
					continue;
				}

				i++; // Skip the value in next iteration

				// Parse value based on type
				switch (option.type) {
					case "string": {
						parsedArgs[key] = value;
						if (development)
							console.log(
								`✅ [CLI Debug] Set string option --${key} to: ${value}`,
							);
						break;
					}
					case "number": {
						const numValue = Number(value);
						if (Number.isNaN(numValue)) {
							if (development)
								console.log(
									`❌ [CLI Debug] Invalid number for --${key}: ${value}`,
								);
							errors.push(`Option --${key} must be a number, got: ${value}`);
						} else {
							parsedArgs[key] = numValue;
							if (development)
								console.log(
									`✅ [CLI Debug] Set number option --${key} to: ${numValue}`,
								);
						}
						break;
					}
					case "array": {
						if (!parsedArgs[key]) {
							parsedArgs[key] = [];
						}
						(parsedArgs[key] as unknown[]).push(value);
						if (development)
							console.log(
								`✅ [CLI Debug] Added to array option --${key}: ${value}`,
							);
						break;
					}
				}
			}
		}
	}

	if (development) console.log("📊 [CLI Debug] Parsed arguments:", parsedArgs);

	// Check for required options
	if (development) console.log("🔍 [CLI Debug] Checking required options...");
	for (const [optionKey, option] of Object.entries(options)) {
		if (option.required && !(option.name in parsedArgs)) {
			if (development)
				console.log(`❌ [CLI Debug] Missing required option: --${option.name}`);
			errors.push(`Required option --${option.name} is missing`);
		} else if (option.required) {
			if (development)
				console.log(`✅ [CLI Debug] Required option present: --${option.name}`);
		}
	}

	// If there are errors, display them and exit
	if (errors.length > 0) {
		if (development)
			console.log("❌ [CLI Debug] Validation failed with errors:", errors);
		console.error("Errors:");
		for (const error of errors) {
			console.error(`  ${error}`);
		}
		console.error(
			`\nUsage: ${name} ${commandName} ${Object.values(options)
				.map((opt) =>
					opt.required ? `--${opt.name} <value>` : `[--${opt.name} <value>]`,
				)
				.join(" ")}`,
		);
		process.exit(1);
	}

	if (development)
		console.log("✅ [CLI Debug] All validations passed, executing command...");

	// Execute the command
	try {
		const typedParsedArgs = parsedArgs as InferArgs<T[typeof commandName]>;
		if (development)
			console.log(
				"🚀 [CLI Debug] Calling command action with args:",
				typedParsedArgs,
			);
		await commandConfig.action(typedParsedArgs, {
			name,
			description,
			command,
		});
		if (development)
			console.log("✅ [CLI Debug] Command executed successfully");
	} catch (error) {
		if (development)
			console.log("❌ [CLI Debug] Command execution failed:", error);
		console.error(`Error executing command ${commandName}:`, error);
		process.exit(1);
	}
	return {
		command: commandName,
		options: parsedArgs as InferArgs<T[typeof commandName]>,
	};
}
