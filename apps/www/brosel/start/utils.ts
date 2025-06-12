import { exists } from "node:fs/promises";
import consola from "consola";
import { getConfig } from "../config/get-config";

export async function checkForRequiredDirectories() {
	const config = await getConfig();
	const dirs = [
		{ name: "assets", path: config.assetsDir },
		{ name: "routes", path: config.routesDir },
		{ name: "pages", path: config.pagesDir },
		{ name: "dev", path: config.devDir },
	];

	for (const dir of dirs) {
		const dirExists = await exists(`${process.cwd()}/${dir.path}`);
		if (!dirExists) {
			consola.error(
				`Directory "${dir.name}" (${dir.path}) not found. Please create it.`,
			);
			process.exit(1);
		}
	}
}
