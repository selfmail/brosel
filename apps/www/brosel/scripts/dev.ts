import tailwindPostcss from "@tailwindcss/postcss";
import consola from "consola";
import postcss from "postcss";

consola.ready("Starting development server...");

const baseFile = await Bun.file(`${process.cwd()}/src/global.css`).text();

const res = await postcss([
	tailwindPostcss({
		base: baseFile,
		optimize: false,
	}),
]).process(baseFile, { from: baseFile });

await Bun.write("output.css", res.css);
