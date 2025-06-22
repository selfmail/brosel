import { exists } from "node:fs/promises";
import { $, type BunRequest, serve } from "bun";
import chalk from "chalk";
import consola from "consola";
import { type MatchFunction, type MatchResult, match } from "path-to-regexp";
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

type Params = Record<string, string | string[]>;

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

// a map to store all the routes with unique paths
const routes = new Map<
	string,
	(req: BunRequest) => Response | Promise<Response>
>();

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
const apiRoutes = new Map<
	string,
	Partial<Record<HttpMethod, (req: BunRequest) => Response | Promise<Response>>>
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

const pathMiddleware = new Map<
	string,
	(req: BunRequest, res: BroselResponse) => Response | Promise<Response>
>();

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
		if (pathMiddleware.has(middleware.path)) {
			consola.warn(
				`Middleware for path ${middleware.path} is already registered. Skipping duplicate.`,
			);
			continue;
		}
		pathMiddleware.set(middleware.path, middleware.middleware);
	} else {
		consola.warn(
			`Unknown middleware type: ${middleware.type}. Please check the path or type!`,
		);
	}
}
function isPathMatching(
	schema: string,
	path: string,
): MatchResult<Params> | false {
	const fn: MatchFunction<Params> = match<Params>(schema);
	return fn(path);
}
// Run the current request handler with a middleware chain
async function runWithMiddleware(
	handler: (req: BunRequest<string>) => Response | Promise<Response>,
	req: BunRequest<"/">,
) {
	// run root middlewares
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
	// run path middlewares
	for (const [middlewarePath, middleware] of pathMiddleware) {
		// check if the pathes are matching
		const url = new URL(req.url);
		const path = url.pathname;
		const matching = isPathMatching(middlewarePath, path);

		// Pathes aren't matching, skip this middleware
		if (!matching) {
			continue; // skip if path does not match
		}

		// run middleware
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

	return await handler(req);
}

for (const [path, handler] of Object.entries(pathObject)) {
	if (typeof handler !== "function") {
		consola.error(`Handler for path ${path} is not a function.`);
		continue;
	}

	if (routes.has(path)) {
		consola.warn(`Path ${path} is already registered. Overwriting.`);
	}

	routes.set(
		path,
		async (req: BunRequest) => await runWithMiddleware(handler, req),
	);
}

// TODO: implement middlewares for routes, with the unique object structure
for (const [path, handler] of Object.entries(routesObject)) {
	if (typeof handler !== typeof {}) {
		consola.warn(`Handler for route ${path} is not an object.`);
		continue;
	}
	if (apiRoutes.has(path)) {
		consola.warn(`Route ${path} is already registered. Overwriting.`);
	} else if (routes.has(path)) {
		consola.error(`Route ${path} is already registered as a page.`);
		process.exit(1);
	}

	apiRoutes.set(path, {
		...Object.fromEntries(
			Object.entries(handler).map(([method, fn]) => [
				method.toUpperCase(),
				async (req: BunRequest) => await runWithMiddleware(fn, req),
			]),
		),
	});
}

globalThis.throwError = throwError;

const server = serve({
	...(parse.data as Bun.ServeFunctionOptions<unknown, object>),
	routes: {
		...Object.fromEntries(routes),
		...Object.fromEntries(apiRoutes),
	},
});

globalThis.server = server;

//console.clear();
console.log(
	`\n${chalk.greenBright(`Server listening on http://${server.hostname}:${server.port} in dev-mode.`)}`,
	`\n${chalk.grey(`Press ${chalk.cyanBright("CTRL + C")} to stop the server.`)}\n`,
);
