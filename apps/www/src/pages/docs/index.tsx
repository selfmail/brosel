import { load, render } from "brosel";
import { loadMarkdownFiles } from "../../../brosel/markdown";
import RootLayout from "../../layouts/root";
import DocsComponent from "./index.client";

export default load({
	path: "/docs",
	handler: async () => {
		const file = (await loadMarkdownFiles("docs")).findMarkdownFile(
			"index",
		) as {
			data: {
				title: string;
				description: string;
				author: string;
			};
			content: string;
			meta: {
				path: string;
				fileName: string;
				fileExtension: string;
			};
		};

		if (!file) return new Response("Not found", { status: 404 });

		const files = (await loadMarkdownFiles("docs")).raw as {
			data: {
				title: string;
				description: string;
				author: string;
			};
			content: string;
			meta: {
				path: string;
				fileName: string;
				fileExtension: string;
			};
		}[];

		if (files.length === 0) {
			return new Response("Not found", { status: 404 });
		}

		return await render({
			component: (
				<DocsComponent
					title={file.data.title}
					files={files}
					content={file.content}
					author={file.data.author}
					description={file.data.description}
				/>
			),
			props: { text: "Hello" },
		});
	},
});
