import { readdir } from "node:fs/promises";
import matter from "gray-matter";
import z from "zod/v4";

export async function loadMarkdownFiles<T extends Record<string, z.ZodType>>({
	path,
	format,
}: { path: string; format: T }) {
	const files = await readdir(path);
	if (!files || files.length === 0) console.warn(`No files found in ${path}`);

	const routes: { path: string; handler: () => Promise<Response> }[] = [];
	const mdFiles: {
		meta: {
			path: string;
			fileName: string;
			fileExtension: string;
		};
		data: z.infer<z.ZodObject<T>>;
		content: string;
	}[] = [];

	for (const file of files) {
		if (file.endsWith(".md")) {
			const content = await Bun.file(`${path}/${file}`).text();

			const json = matter(content);

			const parsed = z
				.object({
					...format,
				})
				.parse(json.data);

			if (!parsed) throw new Error(`Failed to parse ${file}`);

			mdFiles.push({
				meta: {
					path: file.replace(".md", ""),
					fileName: file.replace(".md", ""),
					fileExtension: file.replace(".md", ""),
				},
				data: parsed,
				content,
			});

			routes.push({
				path: `/md/${file.replace(".md", "")}`,
				handler: async () => {
					return new Response(content);
				},
			});
		}
	}

	function findMarkdownFile(path: string) {
		for (const mdFile of mdFiles) {
			if (mdFile.meta.path === path) return mdFile;
		}
	}

	return {
		routes,
		files: mdFiles,
		findMarkdownFile,
	};
}
