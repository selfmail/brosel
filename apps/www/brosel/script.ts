import { getConfig } from "./config/get-config";

/**
 * Get the route of the client script for the current page (via the given path of the file).
 * Please add the parameter `path` to the function. You can get the current path of the file
 * by using `import.meta.path`.
 *
 * Example:
 * ```ts
 * export default load({
 *     path: "/",
 *     handler: async (req, getScript) => {
 *         const script = await getScript(import.meta.path)
 
 *         return await render({
 *             component: <Component />,
 *             props: {
 *                 script
 *             }
 *         })
 * })
 * ```
 */
export async function getClientScriptRoute(path: string) {
	const config = await getConfig();

	let route = path
		.replace(`${process.cwd()}/${config.pagesDir}`, "")
		.replace(".tsx", "")
		.replace("index", "");

	if (route.endsWith("/") && route !== "/") {
		route = route.slice(0, -1);
	}

	const scriptPath: string | undefined =
		globalThis.dev === true ? route : globalThis.scriptPath[route];

	if (!scriptPath) {
		throw new Error(
			`Could not find script for route: ${route}. Please check your code.`,
		);
	}

	return scriptPath;
}
