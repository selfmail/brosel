import { exists } from "node:fs/promises";
import { serve } from "bun";
import chalk from "chalk";
import chokidar from "chokidar";
import consola from "consola";
import ora from "ora";
import { z } from "zod/v4";
import { getConfig } from "../config/get-config";
import { getMarkdownFiles } from "./markdown";
import { ServerSchema } from "./server-options";
import { bundleTailwind } from "./tailwind";

consola.ready("Starting development server...");

const config = await getConfig();

if (config.tailwind) {
	const tailwindSpinner = ora("Tailwind bundling...").start();
	await bundleTailwind();
	tailwindSpinner.succeed("Tailwind bundling done! Watching for changes...");
}

// check for required directories
for (const dir of [config.assetsDir, config.pagesDir, config.routesDir]) {
	if (!(await exists(`${process.cwd()}/${dir}`))) {
		consola.error(`Directory ${dir} not found. Please create it.`);
		process.exit(1);
	}
}

// markdown plugin
await getMarkdownFiles();

const watcher = chokidar.watch(".");

/**
 * An implementation of a "watcher". This watcher checks for updates in the root directory and
 * restarts the server if there are any changes. It's also responsible for removing the client
 * side code in the `.brosel` folder.
 */
watcher.on("change", async (path, stats) => {
	// handling tailwind changes
	if (path.endsWith(".tsx") && config.tailwind) {
		const start = Math.round(performance.now());
		await bundleTailwind();
		const end = Math.round(performance.now());
		consola.info(`Tailwind bundling took ${end - start}ms`);
	}

	// handling routing changes
	if (path.endsWith(".tsx") && path.includes("src/pages")) {
		if (path.endsWith(".client.tsx")) {
			// change in the client file
		}
	}
});

// set global dev variable for hot reloading in the website
globalThis.dev = true;

const mainModule = await import(`${process.cwd()}/src/index.ts`);

if (typeof mainModule.default !== typeof {}) {
	consola.error(
		"The default export in src/index.ts is not a function. It must return the server() function.",
	);
	process.exit(1);
}

// running the main server from "src/index.ts"
const parse = await ServerSchema.safeParseAsync(mainModule.default);
if (!parse.success) {
	consola.error(`Server options error: ${z.prettifyError(parse.error)}`);
	process.exit(1);
}

const server = serve({
	...(parse.data as Bun.ServeFunctionOptions<unknown, object>),
});

globalThis.server = server;

console.log(`Server running on http://${server.hostname}:${server.port}`);
