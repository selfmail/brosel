// TODO: add an implementation for middlewares

import type { BunRequest } from "bun";

type BroselResponse = Response & {
	next: () => never;
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

export function middleware(
	middleware: (
		req: BunRequest,
		res: Response & {
			next: () => never;
			deny: (message?: string) => never;
		},
	) => BroselResponse | Promise<BroselResponse>,
	path: string,
) {
	return {
		type: "middleware" as const,
		middleware,
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
		middleware,
	};
}
