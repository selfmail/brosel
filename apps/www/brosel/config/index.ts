import { z } from "zod/v4";

export const ConfigSchema = z.object({
	tailwind: z.boolean(),

	// Directories
	assetsDir: z.string(),
	pagesDir: z.string(),
	scriptsDir: z.string(),
	devDir: z.string(),
	routesDir: z.string(),

	// files
	globalCSS: z.string(),

	port: z.number(),

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
});

export type Config = Omit<z.infer<typeof ConfigSchema>, "markdown"> & {
	markdown?: Record<
		string,
		{
			path: string;
			extension: string;
			frontmatter: Record<string, z.ZodType>;
		}
	>;
};

export default function config({
	tailwind = true,
	assetsDir = "src/assets",
	pagesDir = "src/pages",
	scriptsDir = "src/scripts",
	devDir = ".brosel",
	globalCSS = "src/global.css",
	routesDir = "src/routes",
	port = 3000,
	markdown,
}: Partial<Config>): Config {
	return {
		tailwind,
		assetsDir,
		pagesDir,
		scriptsDir,
		globalCSS,
		devDir,
		routesDir,
		port,
		markdown,
	};
}
