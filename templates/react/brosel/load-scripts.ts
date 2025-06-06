import { readdir } from "node:fs/promises"

type File = {
    path: string,
    handler:  () => Promise<Response>
}
export async function getScripts(): Promise<File[]> {
    const files: File[] = []

    const scripts = await readdir("./.brosel")

    for (const script of scripts) {
        const path = `/scripts/${script}`
        files.push({
            path,
            handler: async () => {
                return new Response(Bun.file(`./.brosel/${script}`))
            }
        })
    }

    return files
}