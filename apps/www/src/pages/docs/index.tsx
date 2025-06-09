import { load, render } from "brosel";
import RootLayout from "../../layouts/root";
import DocsComponent from "./index.client";

export default load({
	path: "/docs",
	handler: async () => {
		return await render({
			component: <DocsComponent text="Hello" />,
			props: { text: "Hello" },
		});
	},
});
