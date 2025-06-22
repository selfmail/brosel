import { rm } from "node:fs/promises";
import { createId } from "@paralleldrive/cuid2";
import type { BunRequest } from "bun";
import { z } from "zod";
import { getConfig } from "../config/get-config";
import { hydrationTemplate } from "../templates";

export async function loadPages() {
	const config = await getConfig();

	// create new static dir for production
	await rm(`${process.cwd()}/${config.devDir}/static`, {
		recursive: true,
		force: true,
	});
	await rm(`${process.cwd()}/${config.devDir}/client-scripts`, {
		recursive: true,
		force: true,
	});

	globalThis.scriptPath = globalThis.scriptPath || {};

	const pages = new Map<string, (req: BunRequest) => Promise<Response>>();

	const files = new Bun.Glob(`${process.cwd()}/${config.pagesDir}/**/*.tsx`);

	// go through all files, for every <name>.client.tsx file, there must be a <name>.tsx file.
	for await (const file of files.scan(".")) {
		if (file.endsWith(".client.tsx")) continue;

		// check if there is a client file
		const client = Bun.file(file.replace(".tsx", ".client.tsx"));
		if (!client) continue;

		// get the path of the page
		let path = file
			.replace(".tsx", "")
			.split(config.pagesDir)[1]
			?.replace("index", "");

		if (!path) continue;

		if (path.endsWith("/") && path !== "/") {
			path = path.slice(0, -1);
		}

		const serverPage = await import(file);
		if (!serverPage.default) {
			throw new Error(
				`Server function not found for route: ${path}. You have to export a default function which returns a "render()" function.`,
			);
		}

		const parse = await z
			.object({
				path: z.string().optional(),
				handler: z.function().args(z.instanceof(Request)).returns(z.any()),
			})
			.safeParseAsync(await serverPage.default);

		if (!parse.success) {
			console.log(parse.error.issues);
			throw new Error("Failed to parse route");
		}

		const id = createId();

		globalThis.scriptPath[path] = `/scripts/${id}.js`;

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

		const handler = parse.data.handler as (
			req: BunRequest<string>,
		) => Promise<Response>;

		pages.set(parse.data.path ?? path, handler);
	}

	const pagesObject = Object.fromEntries(
		Array.from(pages).map((page) => [page[0], page[1]]),
	);

	return pagesObject;
}
