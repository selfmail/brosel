import { load, render } from "brosel";
import { blog } from "../..";
import AllBlogPostsClient from "./all.client";

export default load({
	path: "/blog/all",
	handler: async () => {
		const blogPosts = (await blog).files;
		return await render({
			component: <AllBlogPostsClient blogPosts={blogPosts} />,
			props: { blogPosts },
		});
	},
});
