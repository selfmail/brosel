import { readdir } from "node:fs/promises";
import type { BunRequest } from "bun";
import { z } from "zod";
import { hydrationTemplate } from "./templates";

interface Page {
	path: string;
	handler: (req: BunRequest<string>) => Promise<Response>;
}

const files: string[] = [];

async function findPageFilesRecursively(
	currentDirPath: string,
	collectedPaths: { clientPath: string; serverPath: string }[],
) {
	const entries = await readdir(currentDirPath, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = `${currentDirPath}/${entry.name}`;
		if (entry.isFile() && entry.name.endsWith(".client.tsx")) {
			const fileName = entry.name.split(".")[0];
			const serverFilePath = `${currentDirPath}/${fileName}.tsx`;
			const serverFile = Bun.file(serverFilePath);

			if (await serverFile.exists()) {
				collectedPaths.push({
					clientPath: fullPath,
					serverPath: serverFilePath,
				});
			} else {
				// If a client file exists but its corresponding server file doesn't, it's an error.
				throw new Error(`Server file not found for client file: ${fullPath}`);
			}
		} else if (entry.isDirectory()) {
			await findPageFilesRecursively(fullPath, collectedPaths);
		}
	}
}

export async function getClientAndServerPagePaths(): Promise<
	{ clientPath: string; serverPath: string }[]
> {
	const pageRoot = `${process.cwd()}/src/pages`;
	const collectedPaths: { clientPath: string; serverPath: string }[] = [];
	await findPageFilesRecursively(pageRoot, collectedPaths);
	return collectedPaths;
}

export async function getPages(): Promise<Page[]> {
	const pages: Page[] = [];

	const files = await getClientAndServerPagePaths();

	console.log(import.meta.url);

	for (const page of files) {
		const routePath = page.clientPath
			.split("/pages")[1]
			?.replace("/index.client.tsx", "")
			.replace(".client.tsx", "");

		if (
			!(
				await import(
					`${process.cwd()}/src/pages${page.clientPath.split("/pages")[1]}`
				)
			).default
		) {
			throw new Error(
				`Client component not found for route: ${routePath}. You have to export a default react component.`,
			);
		}

		// creating client script for hydration
		await Bun.write(
			`./src/static/client${routePath?.replace(/\//g, "-")}.tsx`,
			hydrationTemplate(page.clientPath),
		);

		const build = await Bun.build({
			entrypoints: [`./src/static/client${routePath?.replace(/\//g, "-")}.tsx`],
			outdir: `${process.cwd()}/.brosel`,
			minify: true,
			target: "browser",
		});

		if (!build.success) {
			throw new Error(build.logs.map((log) => log.message).join("\n"));
		}

		// push server page to pages array
		const serverFunction = await import(
			`${process.cwd()}/src/pages${page.serverPath.split("/pages")[1]}`
		);
		if (!serverFunction.default) {
			throw new Error(
				`Server function not found for route: ${routePath}. You have to export a default function which returns a "render()" function.`,
			);
		}

		pages.push({
			path: serverFunction.default.path
				? serverFunction.default.path
				: routePath === ""
					? "/"
					: (routePath as string),
			handler: serverFunction.default.handler,
		});
	}

	console.log(pages);

	return pages;
}
