import { load, render } from "brosel";
import { blog } from "../..";
import AllBlogPostsClient from "./index.client";

export default load({
	handler: async () => {
		return await render({
			component: <AllBlogPostsClient />,
		});
	},
});
