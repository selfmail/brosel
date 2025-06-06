import { readdir } from "node:fs/promises"

type File = {
    path: string,
    handler:  () => Promise<Response>
}

/**
 * Load the assets from the `assets` folder at the root of your project. This function returns an array of an object with the path and the handler
 * for the bun server. You can inslude the assets in your `src/index.ts` file. The files are accessible at the path `/assets/<filename>`.
 * 
 * Example:
 * ```ts
 * import { getAssets } from "brosel"
 * 
 * const assets = await getAssets()
 * 
 * const server = serve({
 *     port: 3000,
 *     routes: {
 *         ...Object.fromEntries(assets.map((asset) => [asset.path, asset.handler])),
 *     }
 * })
 * ```
 */
export async function getAssets(): Promise<File[]> {
    const files: File[] = []

    const assets = await readdir("./assets")

    for (const asset of assets) {
        const path = `/assets/${asset}`
        files.push({
            path,
            handler: async () => {
                return new Response(Bun.file(`./assets/${asset}`))
            }
        })
    }

    return files
}