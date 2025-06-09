import { load, render } from "brosel";
import DocsPageComponent from "./pages.client";

export default load({
	path: "/docs/:id",
	handler: async (req) => {
		const { id } = req.params;
		return await render({
			component: <DocsPageComponent text={id} />,
			props: { text: id },
		});
	},
});
