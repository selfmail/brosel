import { getConfig } from "../config/get-config";

export async function loadAssets() {
	const config = await getConfig();
	const assets = new Bun.Glob(`${process.cwd()}/${config.assetsDir}/**/*`);
	const files: { path: string; handler: () => Response }[] = [];
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

	assetsObject["/assets/styles.css"] = () => {
		return new Response(Bun.file("./.brosel/out.css"));
	};

	return assetsObject;
}
