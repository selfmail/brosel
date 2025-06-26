import { load, render } from "brosel";
import { getClientScriptRoute } from "../../brosel/script";
import Component from "./index.client";

export default load({
	handler: async () => {
		const script = await getClientScriptRoute(import.meta.path);
		return await render({
			component: <Component />,
			props: { script },
		});
	},
});
