import { describe, expect, it } from "bun:test";
import { type CLIConfig, type Option, createCli } from "../src/index";

describe("typecmd", () => {
	it("should create a CLI configuration", () => {
		const config: CLIConfig<{
			test: {
				port: Option;
			};
		}> = {
			name: "test-cli",
			description: "Test CLI",
			commands: {
				test: {
					action: (args) => {
						console.log(args.port);
					},
					options: {
						port: {
							type: "number",
							required: true,
							name: "port",
						},
					},
				},
			},
		};

		expect(config.name).toBe("test-cli");
		expect(config.description).toBe("Test CLI");
		expect(config.commands.test).toBeDefined();
	});

	it("should export types correctly", () => {
		const option: Option = {
			type: "string",
			required: true,
			name: "test",
		};

		expect(option.type).toBe("string");
		expect(option.required).toBe(true);
		expect(option.name).toBe("test");
	});
});
