import tailwindPostcss from "@tailwindcss/postcss";
import postcss from "postcss";
import { getConfig } from "../config/get-config";

export async function bundleTailwind() {
	const config = await getConfig();

	const baseFile = await Bun.file(
		`${process.cwd()}/${config.globalCSS}`,
	).text();
	const res = await postcss([
		tailwindPostcss({
			base: baseFile,
			optimize: false,
		}),
	]).process(baseFile, { from: baseFile });

	await Bun.write(`${process.cwd()}/${config.devDir}/out.css`, res.css);
}
