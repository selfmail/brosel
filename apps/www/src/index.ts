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

export default server({
	port: 3000,
	routes: {
		"/redire": (req) => {
			return new Response("Hello World");
		},
		...Object.fromEntries(routes.map((route) => [route.path, route.handler])),
	},
	hostname: "localhost",
});
