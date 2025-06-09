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
});

export type Config = z.infer<typeof ConfigSchema>;

export default function config({
	tailwind = true,
	assetsDir = "src/assets",
	pagesDir = "src/pages",
	scriptsDir = "src/scripts",
	devDir = ".brosel",
	globalCSS = "src/global.css",
	routesDir = "src/routes",
	port = 3000,
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
	};
}
