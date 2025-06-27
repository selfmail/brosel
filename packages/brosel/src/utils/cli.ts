type OptionType = "string" | "number" | "boolean" | "array";

type Option = {
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

/**
 * Create a new CLI with parsing of commands and options. This cli implementation is completely type safe.
 * You can define commands with the first parameter of the function.
 *
 *  @example
 * ```ts
 * createCli({
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
 * @param param0
 */
export function createCli<
	T extends {
		[key: string]: Record<string, Option>;
	},
>({
	commands,
	name,
	description,
	help,
}: {
	commands: {
		[K in keyof T]: {
			action: (args: InferArgs<T[K]>) => void | Promise<void>;
			options: T[K];
		};
	};
	name: string;
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
}) {
	const scriptArguments = process.argv.slice(2);

	const command = scriptArguments.fill(" ");

	// check if this is the help script
	if (command === help.command) {
	}
}

createCli({
	name: "brosel",
	description: "A CLI tool for Brosel",
	help: {
		answer: `${`${"Brösel"}`}`,
		command: "--help",
	},
	commands: {
		start: {
			action: async (args) => {
				args.port;
				console.log("Starting Brosel with args:", args);
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
