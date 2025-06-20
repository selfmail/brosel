import { exists } from "node:fs/promises";
import { Glob } from "bun";
import matter from "gray-matter";
import { z } from "zod/v4";
import { getConfig } from "./config/get-config";

/**
 * Compile the markdown files from the given path to a json file inside the dev folder.
 * @returns Promise void
 */
export const getMarkdownFiles = async () => {
	const conf = await getConfig();

	if (!conf.markdown) return;

	for await (const [path, config] of Object.entries(conf.markdown) as [
		string,
		{
			path: string;
			extension: string;
			frontmatter: Record<string, z.ZodType>;
		},
	][]) {
		if (!(await exists(`${process.cwd()}/${config.path}`))) {
			console.error(`Directory ${config.path} not found. Please create it.`);
			process.exit(1);
		}

		const files = new Glob(`**/*.${config.extension}`);

		const mdFiles = new Set<{
			meta: {
				path: string;
				fileName: string;
				fileExtension: string;
			};
			data: z.infer<z.ZodObject<typeof config.frontmatter>>;
			content: string;
		}>();

		for await (const file of files.scan(`${process.cwd()}/${config.path}`)) {
			const content = await Bun.file(
				`${process.cwd()}/${config.path}/${file}`,
			).text();

			const json = matter(content);

			const schema = z.object({
				...config.frontmatter,
			});

			const parse = await schema.safeParseAsync(json.data);
			if (!parse.success) {
				console.error(`Failed to parse ${file}`);
				process.exit(1);
			}

			const extension = file.split(".").pop() ?? "";

			mdFiles.add({
				meta: {
					path: file.replace(`.${config.extension}`, ""),
					fileName: file,
					fileExtension: extension,
				},
				data: parse.data,
				content: json.content,
			});
		}

		const text = JSON.stringify(Array.from(mdFiles), null, 2);

		await Bun.write(
			`${process.cwd()}/${conf.devDir}/markdown/${path}.json`,
			text,
		);
	}
};

export const loadMarkdownFiles = async (markdownCollection: string) => {
	const config = await getConfig();
	const files = await Bun.file(
		`${process.cwd()}/${config.devDir}/markdown/${markdownCollection}.json`,
	).text();
	const rawFiles = JSON.parse(files) as {
		meta: {
			path: string;
			fileName: string;
			fileExtension: string;
		};
		data: object;
		content: string;
	}[];

	const findMarkdownFile = (path: string) => {
		for (const mdFile of rawFiles) {
			if (mdFile.meta.path === path) return mdFile;
		}
	};

	return {
		raw: rawFiles,
		findMarkdownFile,
	};
};
