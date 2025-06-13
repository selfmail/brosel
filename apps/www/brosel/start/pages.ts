import type { BunRequest } from "bun";
import { getConfig } from "../config/get-config";

/**
 * The creation of the pages in harder in the production server. We need to encrypt the
 * name of the script file, and we need to add important Headers to the Page.
 */
export async function compileProductionPages() {
	const config = await getConfig();

	const pages = new Map<string, (req: BunRequest) => Promise<string>>();

	const files = new Bun.Glob(`${process.cwd()}/${config.pagesDir}/**/*.tsx`);

	// go through all files, for every <name>.client.tsx file, there must be a <name>.tsx file.
	for await (const file of files.scan(".")) {
		if (file.endsWith(".client.tsx")) continue;

		// check if there is a client file
		if (!Bun.file(file.replace(".tsx", ".client.tsx"))) continue;

		// get the path of the page
		const path = file
			.replace(".tsx", "")
			.split(config.pagesDir)[1]
			?.replace("index", "");

		if (!path) continue;

		const serverPage = await import(file);

		// find the server file
	}

	return pages;
}
