import { load, render } from "brosel";
import Component from "./index.client";

export default load({
	path: "/examples",
	handler: async () => {
		return await render({
			component: <Component />,
			props: {},
		});
	},
});
