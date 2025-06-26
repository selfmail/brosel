import { getClientScriptRoute, load, render } from "brosel";
import DocsPage from "./index.client";

export default load({
	handler: async () => {
		const script = await getClientScriptRoute(import.meta.path);
		return await render({
			component: <DocsPage script={script} />,
			props: {},
		});
	},
	path: "/docs/*",
});
