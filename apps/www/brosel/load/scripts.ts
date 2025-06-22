import { readdir } from "node:fs/promises";
import type { BunRequest } from "bun";
import { getConfig } from "../config/get-config";

export async function loadClientScripts() {
	const files = new Map<string, (req: BunRequest) => Promise<Response>>();
	const config = await getConfig();
	const folder = await readdir(
		`${process.cwd()}/${config.devDir}/client-scripts`,
	);
	for await (const file of folder) {
		if (!file.endsWith(".js")) continue;
		files.set(`/scripts/${file}`, async () => {
			return new Response(
				await Bun.file(`./.brosel/client-scripts/${file}`).text(),
				{
					headers: {
						"Content-Type": "text/javascript",
					},
				},
			);
		});
	}

	const scriptsObject = Object.fromEntries(
		Array.from(files).map((file) => [file[0], file[1]]),
	);

	return scriptsObject;
}
