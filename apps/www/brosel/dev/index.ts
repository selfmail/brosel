import { exists } from "node:fs/promises";
import { $, type BunRequest, serve } from "bun";
import chalk from "chalk";

import consola from "consola";
import { z } from "zod/v4";
import { generateRoutePath } from "../action";
import { getConfig } from "../config/get-config";
import { checkEnv } from "../env";
import { getMarkdownFiles } from "../markdown";
import { ServerSchema } from "../server-options";
import { loadAssets } from "./assets";
import { loadPages } from "./pages";
import { loadRoutes } from "./routes";
import { loadClientScripts } from "./scripts";
import { watcher } from "./watch";

const config = await getConfig();

if (config.tailwind) {
	Bun.spawn(
		[
			"bunx",
			"@tailwindcss/cli",
			"-i",
			`${process.cwd()}/${config.globalCSS}`,
			"-o",
			`${process.cwd()}/.brosel/out.css`,
			"--watch",
		],
		{
			stdout: "ignore",
			stderr: "ignore",
		},
	);
}

// check for required directories
for (const dir of [config.assetsDir, config.pagesDir, config.routesDir]) {
	if (!(await exists(`${process.cwd()}/${dir}`))) {
		consola.error(`Directory ${dir} not found. Please create it.`);
		process.exit(1);
	}
}

if (config.markdown) {
	await getMarkdownFiles();
}

// parse env variables
await checkEnv();

await generateRoutePath();

/**
 * An implementation of a "watcher". This watcher checks for updates in the root directory and
 * restarts the server if there are any changes. It's also responsible for removing the client
 * side code in the `.brosel` folder.
 */
await watcher();

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

const routes = new Map<
	string,
	(req: BunRequest) => Response | Promise<Response>
>();

const routesObject = await loadRoutes();
const pagesObject = await loadPages();
const assetsObject = await loadAssets();
const scriptsObject = await loadClientScripts();
const pathObject = {
	...pagesObject,
	...scriptsObject,
	...assetsObject,
};

for (const [path, handler] of Object.entries(pathObject)) {
	if (typeof handler !== "function") {
		consola.error(`Handler for path ${path} is not a function.`);
		continue;
	}
	if (routes.has(path)) {
		consola.warn(`Path ${path} is already registered. Overwriting.`);
	}
	routes.set(path, handler);
}

for (const [path, handler] of Object.entries(routesObject)) {
	if (typeof handler !== typeof {}) {
		consola.warn(`Handler for route ${path} is not an object.`);
		continue;
	}
	if (routes.has(path)) {
		consola.warn(`Route ${path} is already registered. Overwriting.`);
	}
}

const server = serve({
	...(parse.data as Bun.ServeFunctionOptions<unknown, object>),
	routes: {
		...Object.fromEntries(routes),
		...routesObject,
	},
});

globalThis.server = server;

//console.clear();
console.log(
	`\n${chalk.greenBright(`Server listening on http://${server.hostname}:${server.port} in dev-mode.`)}`,
	`\n${chalk.grey(`Press ${chalk.cyanBright("CTRL + C")} to stop the server.`)}\n`,
);
