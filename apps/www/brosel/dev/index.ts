import { exists } from "node:fs/promises";
import {
	apiRoutesWithMiddleware,
	routesWithMiddleware,
	sortMiddlewares,
} from "brosel/load/middleware";
import { $, serve } from "bun";
import chalk from "chalk";
import consola from "consola";
import { z } from "zod/v4";
import { generateRoutePath } from "../actions";
import { getConfig } from "../config/get-config";
import { checkEnv } from "../env";
import { throwError } from "../error";
import { loadAssets } from "../load/assets";
import { loadPages } from "../load/pages";
import { loadRoutes } from "../load/routes";
import { loadClientScripts } from "../load/scripts";
import { getMarkdownFiles } from "../markdown";
import { type BroselResponse, loadMiddleware } from "../middleware";
import { ServerSchema } from "../server-options";

const config = await getConfig();

if (config.tailwind) {
	const tailwind =
		await $`bunx @tailwindcss/cli -i ./${config.globalCSS} -o ./${config.devDir}/out.css`
			.quiet()
			.nothrow();
	if (tailwind.exitCode !== 0) {
		consola.error(
			`Tailwind CLI failed to run. Please check your Tailwind configuration. Error: ${tailwind.stderr}`,
		);
		process.exit(1);
	}
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

// loaded middlewares
const middlewares = await loadMiddleware();

// load all routes, put them into an object
const routesObject = await loadRoutes();
const pagesObject = await loadPages();
const assetsObject = await loadAssets();
const scriptsObject = await loadClientScripts();
const pathObject = {
	...pagesObject,
	...scriptsObject,
	...assetsObject,
};

globalThis.throwError = throwError;

await sortMiddlewares(middlewares);

const routes = await routesWithMiddleware(pathObject);
const apiRoutes = await apiRoutesWithMiddleware(routesObject);

const server = serve({
	...(parse.data as Bun.ServeFunctionOptions<unknown, object>),
	routes: {
		...routes,
		...apiRoutes,
	},
});

globalThis.server = server;

console.clear();
console.log(
	`\n${chalk.greenBright(`Server listening on http://${server.hostname}:${server.port} in dev-mode.`)}`,
	`\n${chalk.grey(`Press ${chalk.cyanBright("CTRL + C")} to stop the server.`)}\n`,
);
