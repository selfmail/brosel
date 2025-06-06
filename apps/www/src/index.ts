import { getAssets, getPages, getRoutes, getScripts } from "brosel";
import { serve } from "bun";

const port = 3000;

const assets = await getAssets();
const pages = await getPages();
const scripts = await getScripts();
const routes = await getRoutes()


const server = serve({
    port,
    routes: {
        ...Object.fromEntries(assets.map((asset) => [asset.path, asset.handler])),
        ...Object.fromEntries(pages.map((page) => [page.path, page.handler])),
        ...Object.fromEntries(scripts.map((script) => [script.path, script.handler])),
        ...Object.fromEntries(routes.map((route) => [route.path, route.handler])),

        // global.css file
        "/style.css": async () => {
            return new Response(Bun.file("./.brosel/generated.css"))
        },
    }
})

console.log(`Server running on http://localhost:${port}`)