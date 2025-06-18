import { z } from "zod/v4";

export const ConfigSchema = z.object({
	tailwind: z.boolean(),

	// Directories
	assetsDir: z.string(),
	pagesDir: z.string(),
	devDir: z.string(),
	routesDir: z.string(),

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

	env: z.object(z.record(z.string(), z.any())),
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
		NODE_ENV: z.string(),
	},
}: Partial<Config>): Config {
	return {
		tailwind,
		assetsDir,
		routes,
		env,
		pagesDir,
		globalCSS,
		devDir,
		routesDir,
		port,
		markdown,
		secutiry,
	};
}
