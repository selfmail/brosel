import { exists } from "node:fs/promises";
import { $, type BunRequest, serve } from "bun";
import chalk from "chalk";
import consola from "consola";
import { z } from "zod/v4";
import { generateRoutePath } from "../actions";
import { getConfig } from "../config/get-config";
import { checkEnv } from "../env";
import { getMarkdownFiles } from "../markdown";
import { type BroselResponse, loadMiddleware } from "../middleware";
import { ServerSchema } from "../server-options";
import { loadAssets } from "./assets";
import { loadPages } from "./pages";
import { loadRoutes } from "./routes";
import { loadClientScripts } from "./scripts";

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

const routes = new Map<
	string,
	(req: BunRequest) => Response | Promise<Response>
>();

const middlewares = await loadMiddleware();

const routesObject = await loadRoutes();
const pagesObject = await loadPages();
const assetsObject = await loadAssets();
const scriptsObject = await loadClientScripts();
const pathObject = {
	...pagesObject,
	...scriptsObject,
	...assetsObject,
};

const rootMiddleware = new Set<
	(req: BunRequest, res: BroselResponse) => void
>();

const middleware = new Map<
	string,
	(req: BunRequest) => Response | Promise<Response>
>();

const dirMiddleware = new Array<{
	dir: "pages" | "assets" | "routes" | "dev" | "scripts";
	middleware: (
		req: BunRequest,
		res: BroselResponse,
	) => BroselResponse | Promise<BroselResponse>;
	type: "dir-middleware";
}>();

for (const middleware of middlewares) {
	if (middleware.type === "root-middleware") {
		if (rootMiddleware.has(middleware.middleware)) {
			consola.warn(
				`Root middleware ${middleware.middleware.name} is already registered. Skipping duplicate.`,
			);
			continue;
		}
		rootMiddleware.add(middleware.middleware);
	} else if (middleware.type === "middleware" && middleware.path) {
		if (typeof middleware.middleware !== "function") {
			consola.error(
				`Middleware for path ${middleware.path} is not a function. Please check your middleware in ${middleware.dir}.`,
			);
			continue;
		}
		routes.set(middleware.path, middleware.middleware);
	} else if (middleware.type === "dir-middleware" && middleware.dir) {
		const dir = middleware.dir;
		if (!routesObject[dir]) {
			routesObject[dir] = {};
		}
		routesObject[dir][middleware.path || "/"] = middleware.middleware;
	} else {
		consola.warn(
			`Unknown middleware type: ${middleware.type}. Please check your middleware in ${middleware.dir} and the path or dir!`,
		);
	}
}

// Run the current request handler with a middleware chain
async function runWithMiddleware(
	handler: (req: BunRequest<string>) => Response | Promise<Response>,
	req: BunRequest<string>,
) {
	// check for root middlewares
	for (const middleware of rootMiddleware) {
		let nextCalled = false;
		let error: string | null = null;

		const BroselMiddleware = Object.assign(new Response(), {
			next() {
				nextCalled = true;
			},
			deny(message?: string) {
				error = message || "Access denied";
			},
		}) as BroselResponse;
		middleware(req, BroselMiddleware);

		if (error) {
			return new Response(error, { status: 403 });
		}
		if (!nextCalled) {
			return new Response("Middleware did not call next()", { status: 500 });
		}
	}

	return handler(req);
}

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
