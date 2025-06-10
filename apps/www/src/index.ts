import { getAssets, getPages, getRoutes, getScripts } from "brosel";
import { serve } from "bun";
import z from "zod/v4";
import { server } from "../brosel/dev/server-options";
import { loadMarkdownFiles } from "../brosel/markdown";

const port = 3000;

const assets = await getAssets();
const pages = await getPages();
const scripts = await getScripts();
const routes = await getRoutes();
export const blog = loadMarkdownFiles({
	path: "./src/blog",
	format: {
		title: z.string(),
		description: z.string(),
		date: z.date(),
		author: z.string(),
	},
});

const blogRoutes = (await blog).routes.map((route) => [
	route.path,
	route.handler,
]);

serve({
	port,
	routes: {
		...Object.fromEntries(assets.map((asset) => [asset.path, asset.handler])),
		...Object.fromEntries(pages.map((page) => [page.path, page.handler])),
		...Object.fromEntries(
			scripts.map((script) => [script.path, script.handler]),
		),
		...Object.fromEntries(routes.map((route) => [route.path, route.handler])),
		...Object.fromEntries(blogRoutes),

		// global.css file
		"/style.css": async () => {
			return new Response(Bun.file("./.brosel/generated.css"));
		},
	},
	development: true,
	error(error) {
		console.error(error);
	},
});

console.log(`Server running on http://localhost:${3000}`);

export default server({
	port: 3000,
	routes: {
		"/redire": (req) => {
			return new Response("Hello World");
		},
	},
	error: (err) => {
		console.error(err);
		return new Response(err.message, { status: err.code });
	},
	hostname: "localhost",
});
