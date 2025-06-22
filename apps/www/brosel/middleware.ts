// TODO: add an implementation for middlewares

import type { BunRequest } from "bun";
import { getConfig } from "./config/get-config";

export type BroselResponse = Response & {
	next: () => void;
	deny: (message?: string) => never;
};

/**
 * Root Middleware. This middleware is executed for every request. It's optional.
 *
 * Example usage:
 *
 * ```ts
 * import { rootMiddleware } from "brosel/middleware";
 *
 * export default rootMiddleware(async (req, res) => {
 *   // You can access the request and response objects here
 *   // For example, you can set headers or modify the response
 *   res.headers.set("X-Custom-Header", "Hello World");
 *
 *   // You can perform some checks or logic here
 *   if (res.header.get("Authorization") !== "Bearer your-token") {
 *      // this returns you to a customizable error page!
 *      return res.deny("Unauthorized");
 *   }
 *   // You can also call res.next() to continue to the next middleware or route handler
 *   return res.next();
 * }
 * ```
 */
export function rootMiddleware(
	middleware: (
		req: BunRequest,
		res: Response & {
			next: () => never;
			deny: (message?: string) => never;
		},
	) => BroselResponse | Promise<BroselResponse>,
) {
	return {
		type: "root-middleware" as const,
		middleware,
	};
}
/**
 * Normal middleware for pathes. You can specify a certain path or a glob pattern to match multiple paths.
 * This middleware is executed for every request that matches the path.
 *
 * @param middleware - The function that will be executed for the request.
 * @param path - The path or glob pattern to match.
 *
 * Example usage:
 *
 * ```ts
 * import { middleware } from "brosel/middleware";
 *
 * export default middleware(async (req, res) => {
 *   const user. = getUser(req.cookies.get("token"));
 *   if (!user) {
 *     // this returns you to a customizable error page!
 *     return res.deny("Unauthorized");
 *   }
 *   // You can also call res.next() to continue to the next middleware or route handler
 *   return res.next();
 * }, "/api/*");
 * ```
 */
export function middleware<T extends string>(
	middleware: (
		req: BunRequest<T>,
		res: Response & {
			next: () => never;
			deny: (message?: string) => never;
		},
	) => BroselResponse | Promise<BroselResponse>,
	path: T,
) {
	return {
		type: "middleware" as const,
		middleware,
		path,
	};
}

/**
 * Specify a middleware for a specific directory. This means you can specify a custom middleware for
 * your assets, scripts, pages and api-routes.
 * @param middleware - The middleware
 * @param dir - the dir to apply the middleware to. The default directory is "pages". This can be one of the following:
 * - "pages" for the pages directory
 * - "routes" for the api-routes directory
 * - "assets" for the assets directory
 * - "scripts" for the scripts
 *
 * Example usage:
 *
 * ```ts
 * import { dirMiddleware } from "brosel/middleware";
 *
 * export default dirMiddleware(async (req, res) => {
 *   // perform your auth logic
 *   const user = getUser()
 *
 *   if (!user) return res.deny()
 *
 *   res.next()
 * }, "pages");
 * ```
 */
export function dirMiddleware(
	middleware: (
		req: BunRequest,
		res: Response & {
			next: () => never;
			deny: (message?: string) => never;
		},
	) => BroselResponse | Promise<BroselResponse>,
	dir: "pages" | "assets" | "routes" | "dev" | "scripts" = "pages",
) {
	return {
		type: "dir-middleware" as const,
		dir,
		middleware,
	};
}

export type Middleware = "root-middleware" | "middleware";
/**
 * Loads all middlewares into an array, and returns them.
 * This function scans the middleware directory for all files that export a middleware function.
 * @returns An array of middlewares, each with a type, path and the middleware function.
 */
export async function loadMiddleware() {
	const config = await getConfig();

	const middlewares: {
		type: Middleware;
		path?: string;
		middleware: (
			req: BunRequest<string>,
			res: BroselResponse,
		) => BroselResponse | Promise<BroselResponse>;
		dir?: "pages" | "assets" | "routes" | "dev" | "scripts";
	}[] = [];

	if (config.middleWareDir) {
		const glob = new Bun.Glob("**/*.ts");
		const dirPath = `${process.cwd()}/${config.middleWareDir}`;
		for await (const file of glob.scan(dirPath)) {
			const mod = (await import(
				`${process.cwd()}/${config.middleWareDir}/${file}`
			)) as {
				[key: string]: {
					type: Middleware;
					middleware: (
						req: BunRequest,
						res: BroselResponse,
					) => BroselResponse | Promise<BroselResponse>;
					path?: string;
					dir?: "pages" | "assets" | "routes" | "dev" | "scripts";
				};
			};
			for (const key in mod) {
				const exported = mod[key];
				if (
					exported &&
					(exported.type === "root-middleware" ||
						exported.type === "middleware" ||
						exported.type === "dir-middleware")
				) {
					const entry: {
						type: Middleware;
						path?: string;
						middleware: (
							req: BunRequest,
							res: BroselResponse,
						) => BroselResponse | Promise<BroselResponse>;
						dir?: "pages" | "assets" | "routes" | "dev" | "scripts";
					} = {
						type: exported.type,
						middleware: exported.middleware,
					};
					if (exported.type === "middleware" && exported.path) {
						entry.path = exported.path;
					}
					middlewares.push(entry);
				}
			}
		}
	}

	return middlewares;
}
