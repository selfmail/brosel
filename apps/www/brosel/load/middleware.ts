import type { BroselResponse } from "brosel/middleware";
import type { BunRequest } from "bun";
import consola from "consola";
import { type MatchFunction, type MatchResult, match } from "path-to-regexp";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Map for all routes, for example pages, assets and scripts
const routes = new Map<
	string,
	(req: BunRequest) => Response | Promise<Response>
>();

// map for the api routes, which need a new map because they can have multiple methods
const apiRoutes = new Map<
	string,
	Partial<Record<HttpMethod, (req: BunRequest) => Response | Promise<Response>>>
>();

/**
 * The map & set for the middlewares. We use a set for the root middlewares because they don't need
 * a unique path, and a map for the path middlewares because they need a unique path.
 */
const rootMiddleware = new Set<
	(req: BunRequest, res: BroselResponse) => void
>();

const pathMiddleware = new Map<
	string,
	(req: BunRequest, res: BroselResponse) => Response | Promise<Response>
>();

type Middleware = {
	type: "root-middleware" | "middleware";
	path?: string;
	middleware: (
		req: BunRequest<string>,
		res: BroselResponse,
	) => BroselResponse | Promise<BroselResponse>;
}[];

export async function sortMiddlewares(middlewares: Middleware) {
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
}

// Run a handler with the middleware chain

type Params = Record<string, string | string[]>;

function isPathMatching(
	schema: string,
	path: string,
): MatchResult<Params> | false {
	const fn: MatchFunction<Params> = match<Params>(schema);
	return fn(path);
}

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

/**
 * Loads middleware for the serve() function in the starting script.
 */

type Routes = Promise<
	Record<
		string,
		Partial<
			Record<HttpMethod, (req: BunRequest) => Response | Promise<Response>>
		>
	>
>;

export async function apiRoutesWithMiddleware(routesObject: {
	[k: string]: Partial<
		Record<HttpMethod, (req: Request) => Response | Promise<Response>>
	>;
}): Routes {
	for (const [path, handler] of Object.entries(routesObject)) {
		if (typeof handler !== typeof {}) {
			throw new Error(
				`Handler for route ${path} is not an object. Expected an object with methods like "get", "post", etc.`,
			);
		}
		if (apiRoutes.has(path)) {
			consola.warn(`Route ${path} is already registered. Overwriting.`);
		} else if (routes.has(path)) {
			throw new Error(
				`The path of the route ${path} is already registerd as a page or asset.`,
			);
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

	return Object.fromEntries(apiRoutes);
}

export async function routesWithMiddleware(pathObject: {
	[x: string]:
		| ((req: BunRequest) => Promise<Response>)
		| (() => Response | Promise<Response>)
		| ((req: BunRequest) => Promise<Response>);
}) {
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

	return Object.fromEntries(routes);
}
