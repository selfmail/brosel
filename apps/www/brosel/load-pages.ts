import { z } from "zod";
import { hydrationTemplate } from "./templates";
import type { BunRequest } from "bun";

interface Page {
    path: string,
    handler: (req: BunRequest<string>) => Promise<Response>
}

export async function getPages(): Promise<Page[]> {
    const router = new Bun.FileSystemRouter({
        style: "nextjs",
        dir: `${process.cwd()}/src/pages`,
    });

    const pages: Page[] = [];

    for (const page of Object.keys(router.routes)) {
        let file = page === "/" ? "/index" : page;
        const module = await import(`${process.cwd()}/src/pages${file}.tsx`);

        const schema = await  z.object({
            component: z.any(),
            server: z.object({
                path: z.string().optional(),
                handler: z.function()
            })
        }).safeParseAsync({
            component: module.component,
            server: module.server || module.default,
        })

        if (!schema.success) {
            console.error(`Failed to parse the page ${file}. Error: ${schema.error}`);
            break
        }

        await Bun.write(`./src/static/client${file.replace(/\//g, "-")}.tsx`, hydrationTemplate(file));

        const build = await Bun.build({
            entrypoints: [
                `./src/static/client${file.replace(/\//g, "-")}.tsx`
            ],
            outdir: `${process.cwd()}/.brosel`,
            minify: true,
            target: "browser",
        })

        if (!build.success) {
            throw new Error(build.logs.map(log => log.message).join("\n"))
        }


        pages.push({
            path: module.server?.path || module.default?.path || page,
            handler: module.server?.handler || module.default?.handler
        })
    }

    console.log(`> Built ${pages.length} page${pages.length === 1 ? "" : "s"}`)

    return pages
}