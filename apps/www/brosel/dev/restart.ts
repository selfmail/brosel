import { exists, rm } from "node:fs/promises";
import { $, type BunRequest } from "bun";
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

/**
 * Function to restart the Brosel server.
 */
export async function restart() {
	if (!globalThis.server) {
		consola.error("Server is not initialized. Cannot restart.");
		return;
	}

	const startTime = performance.now();

	// the following code is a copy of the code in `/brosel/dev/index.ts` file
	const config = await getConfig();

	await rm(`${process.cwd()}/${config.devDir}`, {
		recursive: true,
		force: true,
	});

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

	// generate the route pathes for the action.ts file (useAction Hook)
	await generateRoutePath();

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
		(req: BunRequest<string>) => Response | Promise<Response>
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

	// checking the path of assets, pages and scripts
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
			consola.error(`Handler for route ${path} is not an object.`);
			return;
		}
	}

	const server = globalThis.server;

	server.reload({
		routes: {
			...Object.fromEntries(routes),
			...routesObject,
		},
	});

	const end = performance.now();
	const time = (end - startTime).toFixed(2);
	console.clear();
	console.log(
		`\n${chalk.greenBright(`Server running on http://${server.hostname}:${server.port} in dev-mode.`)}`,
		`\n${chalk.grey(`Press ${chalk.cyanBright("CTRL + C")} to stop the server. It took ${time}ms to restart server.`)}\n`,
	);
}

let restartTimeout: NodeJS.Timeout | null = null;

/**
 * Debounced function to restart the Brosel server.
 */
export function debouncedRestart() {
	if (restartTimeout) {
		clearTimeout(restartTimeout);
	}
	restartTimeout = setTimeout(async () => {
		await restart();
		restartTimeout = null;
	}, 500);
}
