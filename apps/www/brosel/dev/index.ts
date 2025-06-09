import { exists } from "node:fs/promises";
import chokidar from "chokidar";
import consola from "consola";
import ora from "ora";
import { getConfig } from "../config/get-config";
import { bundleTailwind } from "./tailwind";

consola.ready("Starting development server...");

const config = await getConfig();

if (config.tailwind) {
	const tailwindSpinner = ora("Tailwind bundling...").start();
	await bundleTailwind();
	tailwindSpinner.succeed("Tailwind bundling done! Watching for changes...");

	chokidar.watch(".").on("all", async (event, path) => {
		await bundleTailwind();
	});
}

// check for required directories
for (const dir of [config.assetsDir, config.pagesDir, config.routesDir]) {
	if (!(await exists(`${process.cwd()}/${dir}`))) {
		consola.error(`Directory ${dir} not found. Please create it.`);
		process.exit(1);
	}
}

