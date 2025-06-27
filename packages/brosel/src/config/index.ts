import { z } from "zod/v4";

const createAsyncFunctionSchema = <T extends z.core.$ZodFunction>(schema: T) =>
	z.custom<Parameters<T["implementAsync"]>[0]>((fn) =>
		schema.implementAsync(fn as () => void),
	);

const LoggingSchema = z.object({
	logToFile: z.object({
		enabled: z.boolean(),
		file: z.string(),
	}),
	logStartingWarningsToConsole: z.boolean(),
	logStartingInfosToConsole: z.boolean(),
	customLogFunction: createAsyncFunctionSchema(
		z.function({ input: z.tuple([]), output: z.promise(z.string()) }),
	).optional(),
});

export const ConfigSchema = z.object({
	tailwind: z.boolean(),

	// Directories
	assetsDir: z.string(),
	pagesDir: z.string(),
	devDir: z.string(),
	routesDir: z.string(),
	middleWareDir: z.string(),

	// secutiry
	secutiry: z.object({
		runAuditInProduction: z.boolean(),
	}),

	// files
	globalCSS: z.string(),

	port: z.number(),

	routes: z.object({
		assetsPath: z.string(),
		routesPath: z.string().optional(),
		scriptPath: z.string(),
	}),

	// plugins
	markdown: z
		.record(
			z.string(),
			z.object({
				path: z.string(),
				extension: z.string(),
				frontmatter: z.record(z.string(), z.any()),
			}),
		)
		.optional(),

	env: z.record(z.string(), z.any()),

	logging: LoggingSchema,
});

export type Config = Omit<z.infer<typeof ConfigSchema>, "markdown" | "env"> & {
	markdown?: Record<
		string,
		{
			path: string;
			extension: string;
			frontmatter: Record<string, z.ZodType>;
		}
	>;
	env: Record<string, z.ZodType>;
};

export default function config({
	tailwind = true,
	middleWareDir = "src/middleware",
	assetsDir = "src/assets",
	pagesDir = "src/pages",
	devDir = ".brosel",
	globalCSS = "src/global.css",
	routesDir = "src/routes",
	port = 3000,
	routes = {
		assetsPath: "/assets",
		scriptPath: "/scripts",
	},
	markdown,
	secutiry = {
		runAuditInProduction: true,
	},
	env = {
		NODE_ENV: z.enum(["development", "production"]).optional(),
	},

	logging = {
		logToFile: {
			enabled: false,
			file: "logs/brosel.log",
		},
		logStartingWarningsToConsole: true,
		logStartingInfosToConsole: false,
		customLogFunction: undefined,
	},
}: Partial<Config>): Config {
	return {
		tailwind,
		middleWareDir,
		assetsDir,
		routes,
		env,
		logging,
		pagesDir,
		globalCSS,
		devDir,
		routesDir,
		port,
		markdown,
		secutiry,
	};
}

export async function parseConfig(
	config: Config,
): Promise<{ error: string } | { data: Config }> {
	const parse = await ConfigSchema.safeParseAsync(config);

	if (!parse.success) {
		const prettyError = z.prettifyError(parse.error);

		return {
			error: prettyError,
		};
	}

	return {
		data: parse.data,
	};
}

export async function getConfig() {
	const config = await import(`${process.cwd()}/config.ts`);
	if (!config.default) {
		console.error(
			"No config.ts file found in the root of your project. Please create one and return congig() function from it.",
		);
		process.exit(1);
	}

	const parse = await parseConfig(config.default);
	if ("error" in parse) {
		console.error(`Config Error: ${parse.error}`);
		process.exit(1);
	}

	return parse.data;
}
