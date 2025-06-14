import { rm } from "node:fs/promises";
import { createId } from "@paralleldrive/cuid2";
import type { BunRequest } from "bun";
import consola from "consola";
import { getConfig } from "../config/get-config";
import { hydrationTemplate } from "../templates";

/**
 * The creation of the pages in harder in the production server. We need to encrypt the
 * name of the script file, and we need to add important Headers to the Page.
 */
export async function compileProductionPages() {
	const config = await getConfig();

	// create new static dir for production
	await rm(`${process.cwd()}/${config.devDir}/static`, {
		recursive: true,
		force: true,
	});

	const pages = new Map<string, (req: BunRequest) => Promise<string>>();

	const files = new Bun.Glob(`${process.cwd()}/${config.pagesDir}/**/*.tsx`);

	// go through all files, for every <name>.client.tsx file, there must be a <name>.tsx file.
	for await (const file of files.scan(".")) {
		if (file.endsWith(".client.tsx")) continue;

		// check if there is a client file
		const client = Bun.file(file.replace(".tsx", ".client.tsx"));
		if (!client) continue;

		// get the path of the page
		const path = file
			.replace(".tsx", "")
			.split(config.pagesDir)[1]
			?.replace("index", "");

		if (!path) continue;

		const id = createId();

		globalThis.scriptPath.path = `/scripts/${id}.js`;

		await Bun.write(
			`${process.cwd()}/${config.devDir}/static/${id}.tsx`,
			hydrationTemplate(file.replace(".tsx", ".client.tsx")),
		);

		await Bun.build({
			entrypoints: [`${process.cwd()}/${config.devDir}/static/${id}.tsx`],
			outdir: `${process.cwd()}/${config.devDir}/client-scripts`,
			minify: true,
			target: "browser",
		});
	}

	console.log(globalThis.scriptPath);

	return pages;
}
