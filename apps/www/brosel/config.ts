export type Config = {
	tailwind: boolean;

	// Directories
	assetsDir: string;
	pagesDir: string;
	scriptsDir: string;
	devDir: string;
	routesDir: string;

	// Security Options

	// Port
	port: number;
};

export default function config({
	tailwind = true,
	assetsDir = "src/assets",
	pagesDir = "src/pages",
	scriptsDir = "src/scripts",
	devDir = "src/dev",
	routesDir = "src/routes",
	port = 3000,
}: Partial<Config>): Config {
	return {
		tailwind,
		assetsDir,
		pagesDir,
		scriptsDir,
		devDir,
		routesDir,
		port,
	};
}
