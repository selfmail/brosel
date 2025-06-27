import { describe, expect, it, test } from "bun:test";
import { z } from "zod/v4";
import config, {
	parseConfig,
	ConfigSchema,
	type Config,
} from "../src/config/index.ts";

describe("Config", () => {
	describe("config function", () => {
		test("should return default config when no parameters provided", () => {
			const result = config({});

			expect(result.tailwind).toBe(true);
			expect(result.middleWareDir).toBe("src/middleware");
			expect(result.assetsDir).toBe("src/assets");
			expect(result.pagesDir).toBe("src/pages");
			expect(result.devDir).toBe(".brosel");
			expect(result.globalCSS).toBe("src/global.css");
			expect(result.routesDir).toBe("src/routes");
			expect(result.port).toBe(3000);
			expect(result.routes).toEqual({
				assetsPath: "/assets",
				scriptPath: "/scripts",
			});
			expect(result.secutiry).toEqual({
				runAuditInProduction: true,
			});
			expect(result.env).toBeDefined();
			expect(result.env.NODE_ENV).toBeDefined();
			expect(result.logging).toEqual({
				logToFile: {
					enabled: false,
					file: "logs/brosel.log",
				},
				logStartingWarningsToConsole: true,
				logStartingInfosToConsole: false,
				customLogFunction: undefined,
			});
		});

		test("should override default values with provided parameters", () => {
			const customConfig = config({
				tailwind: false,
				port: 4000,
				assetsDir: "custom/assets",
				pagesDir: "custom/pages",
				middleWareDir: "custom/middleware",
				routesDir: "custom/routes",
				globalCSS: "custom/global.css",
				devDir: "custom/.brosel",
				routes: {
					assetsPath: "/custom-assets",
					scriptPath: "/custom-scripts",
					routesPath: "/custom-routes",
				},
				secutiry: {
					runAuditInProduction: false,
				},
				env: {
					NODE_ENV: z.enum(["development", "production"]).optional(),
					CUSTOM_VAR: z.string(),
				},
				logging: {
					logToFile: {
						enabled: true,
						file: "custom/logs/app.log",
					},
					logStartingWarningsToConsole: false,
					logStartingInfosToConsole: true,
				},
			});

			expect(customConfig.tailwind).toBe(false);
			expect(customConfig.port).toBe(4000);
			expect(customConfig.assetsDir).toBe("custom/assets");
			expect(customConfig.pagesDir).toBe("custom/pages");
			expect(customConfig.middleWareDir).toBe("custom/middleware");
			expect(customConfig.routesDir).toBe("custom/routes");
			expect(customConfig.globalCSS).toBe("custom/global.css");
			expect(customConfig.devDir).toBe("custom/.brosel");
			expect(customConfig.routes.routesPath).toBe("/custom-routes");
			expect(customConfig.secutiry.runAuditInProduction).toBe(false);
			expect(customConfig.logging.logToFile.enabled).toBe(true);
			expect(customConfig.env).toBeDefined();
			expect(customConfig.env.CUSTOM_VAR).toBeDefined();
		});

		test("should handle markdown configuration", () => {
			const configWithMarkdown = config({
				markdown: {
					blog: {
						path: "src/blog",
						extension: ".md",
						frontmatter: {
							title: z.string(),
							date: z.date(),
						},
					},
				},
			});

			expect(configWithMarkdown.markdown).toBeDefined();
			expect(configWithMarkdown.markdown?.blog?.path).toBe("src/blog");
			expect(configWithMarkdown.markdown?.blog?.extension).toBe(".md");
		});

		test("should handle partial configuration updates", () => {
			const partialConfig = config({
				port: 8080,
				tailwind: false,
			});

			expect(partialConfig.port).toBe(8080);
			expect(partialConfig.tailwind).toBe(false);
			// Should still have defaults for non-specified values
			expect(partialConfig.assetsDir).toBe("src/assets");
			expect(partialConfig.pagesDir).toBe("src/pages");
		});

		test("should handle empty routes path", () => {
			const configWithEmptyRoutesPath = config({
				routes: {
					assetsPath: "/assets",
					scriptPath: "/scripts",
					routesPath: "",
				},
			});

			expect(configWithEmptyRoutesPath.routes.routesPath).toBe("");
		});

		test("should handle complex markdown configuration with multiple entries", () => {
			const configWithMultipleMarkdown = config({
				markdown: {
					blog: {
						path: "src/blog",
						extension: ".md",
						frontmatter: {
							title: z.string(),
							date: z.date(),
						},
					},
					docs: {
						path: "src/docs",
						extension: ".mdx",
						frontmatter: {
							title: z.string(),
							author: z.string(),
							category: z.enum(["guide", "reference", "tutorial"]),
						},
					},
				},
			});

			expect(configWithMultipleMarkdown.markdown).toBeDefined();
			expect(configWithMultipleMarkdown.markdown?.blog?.path).toBe("src/blog");
			expect(configWithMultipleMarkdown.markdown?.docs?.path).toBe("src/docs");
		});

		test("should handle custom logging function", () => {
			const customLogFunction = async () => "custom log message";
			const configWithCustomLogging = config({
				logging: {
					logToFile: {
						enabled: true,
						file: "custom.log",
					},
					logStartingWarningsToConsole: false,
					logStartingInfosToConsole: true,
					customLogFunction,
				},
			});

			expect(configWithCustomLogging.logging.customLogFunction).toBe(
				customLogFunction,
			);
		});
	});

	describe("parseConfig function", () => {
		test("should successfully parse valid config", async () => {
			const validConfig = config({});
			const result = await parseConfig(validConfig);

			expect("data" in result).toBe(true);
			if ("data" in result) {
				expect(result.data.tailwind).toBe(true);
				expect(result.data.port).toBe(3000);
			}
		});

		test("should return error for invalid config - missing required fields", async () => {
			const invalidConfig = {
				tailwind: true,
				// Missing required fields
			} as Config;

			const result = await parseConfig(invalidConfig);

			expect("error" in result).toBe(true);
			if ("error" in result) {
				expect(result.error).toContain("assetsDir");
			}
		});

		test("should return error for invalid config - wrong types", async () => {
			const invalidConfig = {
				...config({}),
				port: "not-a-number", // Should be number
			} as unknown as Config;

			const result = await parseConfig(invalidConfig);

			expect("error" in result).toBe(true);
			if ("error" in result) {
				expect(result.error).toBeDefined();
			}
		});

		test("should validate logging configuration", async () => {
			const configWithInvalidLogging = {
				...config({}),
				logging: {
					logToFile: {
						enabled: "not-a-boolean", // Should be boolean
						file: "logs/brosel.log",
					},
					logStartingWarningsToConsole: true,
					logStartingInfosToConsole: false,
				},
			} as unknown as Config;

			const result = await parseConfig(configWithInvalidLogging);

			expect("error" in result).toBe(true);
		});

		test("should validate security configuration", async () => {
			const configWithInvalidSecurity = {
				...config({}),
				secutiry: {
					runAuditInProduction: "not-a-boolean", // Should be boolean
				},
			} as unknown as Config;

			const result = await parseConfig(configWithInvalidSecurity);

			expect("error" in result).toBe(true);
		});

		test("should validate routes configuration", async () => {
			const configWithInvalidRoutes = {
				...config({}),
				routes: {
					assetsPath: 123, // Should be string
					scriptPath: "/scripts",
				},
			} as unknown as Config;

			const result = await parseConfig(configWithInvalidRoutes);

			expect("error" in result).toBe(true);
		});

		test("should handle optional markdown configuration", async () => {
			const configWithMarkdown = config({
				markdown: {
					docs: {
						path: "src/docs",
						extension: ".mdx",
						frontmatter: {
							title: z.string(),
							author: z.string(),
						},
					},
				},
			});

			const result = await parseConfig(configWithMarkdown);

			expect("data" in result).toBe(true);
			if ("data" in result) {
				expect(result.data.markdown).toBeDefined();
			}
		});

		test("should handle env configuration with zod schemas", async () => {
			const configWithEnv = config({
				env: {
					NODE_ENV: z.enum(["development", "production"]).optional(),
					DATABASE_URL: z.string(),
					API_KEY: z.string().optional(),
				},
			});

			const result = await parseConfig(configWithEnv);

			expect("data" in result).toBe(true);
			if ("data" in result) {
				expect(result.data.env).toBeDefined();
			}
		});
	});

	describe("parseConfig function - advanced validation", () => {
		test("should validate nested object structures", async () => {
			const configWithDeepInvalidData = {
				...config({}),
				routes: {
					assetsPath: "/assets",
					scriptPath: "/scripts",
					routesPath: {
						invalid: "nested object", // Should be string
					},
				},
			} as unknown as Config;

			const result = await parseConfig(configWithDeepInvalidData);

			expect("error" in result).toBe(true);
		});

		test("should validate markdown structure when provided", async () => {
			const configWithInvalidMarkdown = {
				...config({}),
				markdown: {
					blog: {
						path: "src/blog",
						// missing extension
						frontmatter: {},
					},
				},
			} as unknown as Config;

			const result = await parseConfig(configWithInvalidMarkdown);

			expect("error" in result).toBe(true);
		});

		test("should handle edge case with zero port", async () => {
			const configWithZeroPort = config({ port: 0 });
			const result = await parseConfig(configWithZeroPort);

			expect("data" in result).toBe(true);
			if ("data" in result) {
				expect(result.data.port).toBe(0);
			}
		});

		test("should validate that all required directories are strings", async () => {
			const configWithInvalidDirs = {
				...config({}),
				assetsDir: 123,
				pagesDir: true,
				devDir: null,
			} as unknown as Config;

			const result = await parseConfig(configWithInvalidDirs);

			expect("error" in result).toBe(true);
		});
	});

	describe("ConfigSchema", () => {
		test("should be defined and accessible", () => {
			expect(ConfigSchema).toBeDefined();
			expect(typeof ConfigSchema.parse).toBe("function");
		});

		test("should validate complete config object", async () => {
			const completeConfig = {
				tailwind: true,
				assetsDir: "src/assets",
				pagesDir: "src/pages",
				devDir: ".brosel",
				routesDir: "src/routes",
				middleWareDir: "src/middleware",
				secutiry: {
					runAuditInProduction: true,
				},
				globalCSS: "src/global.css",
				port: 3000,
				routes: {
					assetsPath: "/assets",
					routesPath: "/api",
					scriptPath: "/scripts",
				},
				env: {
					NODE_ENV: z.enum(["development", "production"]).optional(),
				},
				logging: {
					logToFile: {
						enabled: false,
						file: "logs/brosel.log",
					},
					logStartingWarningsToConsole: true,
					logStartingInfosToConsole: false,
				},
			};

			const result = await ConfigSchema.safeParseAsync(completeConfig);
			expect(result.success).toBe(true);
		});
	});

	describe("getConfig function", () => {
		test("should be a function that exists", () => {
			// Simple test to verify the function exists and is callable
			// More complex testing would require filesystem mocking which is beyond the scope
			const { getConfig } = require("../src/config/index.ts");
			expect(typeof getConfig).toBe("function");
		});
	});
});
