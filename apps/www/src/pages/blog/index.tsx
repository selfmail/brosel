import { load, render } from "brosel";
import { blog } from "../..";
import AllBlogPostsClient from "./index.client";

export default load({
	handler: async () => {
		const blogPosts = (await blog).files;
		return await render({
			component: <AllBlogPostsClient blogPosts={blogPosts} />,
			props: { blogPosts },
		});
	},
});
