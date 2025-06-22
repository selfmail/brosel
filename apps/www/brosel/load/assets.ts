import { getConfig } from "../config/get-config";

export async function loadAssets() {
	const config = await getConfig();
	const assets = new Bun.Glob(`${process.cwd()}/${config.assetsDir}/**/*`);
	const files: { path: string; handler: () => Response | Promise<Response> }[] =
		[];
	for await (const file of assets.scan()) {
		files.push({
			path: file.replace(`${process.cwd()}/${config.assetsDir}/`, "/assets/"),
			handler: () => {
				return new Response(Bun.file(file));
			},
		});
	}

	const assetsObject = Object.fromEntries(
		files.map((file) => [file.path, file.handler]),
	);

	assetsObject["/assets/styles.css"] = async () => {
		return new Response(
			await Bun.file(`${process.cwd()}/${config.devDir}/out.css`).text(),
			{
				headers: {
					"Content-Type": "text/css",
				},
			},
		);
	};

	return assetsObject;
}
