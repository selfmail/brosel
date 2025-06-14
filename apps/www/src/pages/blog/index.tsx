import { load, render } from "brosel";

import { loadMarkdownFiles } from "../../../brosel/markdown";
import { getClientScriptRoute } from "../../../brosel/script";
import AllBlogPostsClient from "./index.client";

export default load({
	handler: async () => {
		const script = await getClientScriptRoute(import.meta.path);
		const posts = await loadMarkdownFiles("blog");

		console.log(posts);

		return await render({
			component: (
				<AllBlogPostsClient blogPosts={posts.raw as any} script={script} />
			),
			props: {
				script,
			},
		});
	},
});
