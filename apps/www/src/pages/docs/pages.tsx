import { getClientScriptRoute, load, loadMarkdownFiles, render } from "brosel";
import DocsPageComponent from "./pages.client";

export default load({
	path: "/docs/:id",
	handler: async (req) => {
		const { id } = req.params;

		if (!id) new Response("Not Found", { status: 404 });

		const file = (await loadMarkdownFiles("docs")).findMarkdownFile(id) as
			| {
					meta: {
						path: string;
						fileName: string;
						fileExtension: string;
					};
					data: {
						title: string;
						description: string;
						author: string;
					};
					content: string;
			  }
			| undefined;

		if (!file) {
			return new Response("Not Found", { status: 404 });
		}

		const script = await getClientScriptRoute(import.meta.path);

		return await render({
			component: <DocsPageComponent script={script} doc={file} />,
			props: { text: id },
		});
	},
});
