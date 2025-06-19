/*
This file contains utils for the `brosel` framework. These utils are mostly
functions that are used to render a page or route on the server.
*/

import type { BunRequest } from "bun";
import { renderToReadableStream } from "react-dom/server";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type LoadConfig<T extends string> = {
	/**
	 * We could also use the path from the file system router,
	 * so this option is optional, but needed when you want a
	 * catch-all route.
	 */
	path?: T;
	/**
	 * The function will be called when a request comes to the server.
	 * The code in this function will be executed on the server. You return the
	 * "render" function to render a page.
	 */
	handler: (req: BunRequest<T>) => Promise<Response>;
};

/**
 * This function is used for the `pages`, not the apis. The code inside `handler` will be executed on the server,
 * you have to return the `render` function with the component and the props to render the page.
 *
 * Example:
 * ```ts
 * import { load, render } from "brosel"
 *
 * export default load({
 *     // Note: the file path is getting overwritten with this option.
 *     path: "/",
 *     handler: async (req) => {
 *         const name = req.query.get("name") ?? "World"
 *         return await render({
 *             render: <h1>Hello {name}</h1>
 *             props: {
 *                 name
 *             }
 *         })
 *     }
 * })
 * ```
 */
export const load = async <T extends string>({
	path,
	handler,
}: LoadConfig<T>) => {
	return {
		path,
		handler,
	};
};
/**
 * This function is used to render a page. This function has to be returned from the `load` function in order to render a page.
 * The React component will be rendered with the `renderToReadableStream` function from the `react-dom/server` package. After that,
 * the rendered stream will be returned as a bun response.
 *
 * **Props:**
 *
 * You can pass props from the server to the client. The values you use in the client have to be passed through the `props` object. This
 * is important to save the props after the render and before the hydration of the client's page.
 *
 * Example:
 * ```ts
 * import { load, render } from "brosel"
 *
 * export default load({
 *     path: "/",
 *     handler: async (req) => {
 *         const name = req.query.get("name") ?? "World"
 *         return await render({
 *             component: Component({ name }),
 *             props: {
 *                 name
 *             }
 *         })
 *     }
 * })
 * ```
 */
export const render = async ({
	component,
	props,
}: {
	component:
		| ((props: Record<string, unknown> | undefined) => React.ReactNode)
		| React.ReactNode;
	props: Record<string, unknown> | undefined;
}) => {
	const elementToRender =
		typeof component === "function" ? component(props) : component;
	const stream = await renderToReadableStream(elementToRender, {});
	return new Response(stream, {
		headers: {
			"Content-Type": "text/html",
		},
	});
};

type Routes<T extends string> = Partial<
	Record<HttpMethod, (req: BunRequest<T>) => Response | Promise<Response>>
>;

/**
 * A route is similar to a page, but it doesn't have to export a react component. It can be used to
 * create api routes, for example. You return in the `handler` function a bun response.
 *
 * Example:
 * ```ts
 * import { route } from "brosel"
 *
 * export default route({
 *     path: "/api/demo",
 *     handler: async (req) => {
 *         return new Response("Hello World")
 *     }
 * })
 * ```
 * You can now "GET" the route at `/api/demo`.
 */
export const route = <T extends string>(routes: Routes<T>, path: T) => {
	return {
		path,
		routes,
	};
};
