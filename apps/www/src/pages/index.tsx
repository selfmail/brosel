import { load, render } from "brosel";
import Component from "./index.client";

export default load({
	handler: async () => {
		return await render({
			component: <Component />,
			props: {},
		});
	},
});
