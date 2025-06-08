import RootLayout from "../../layouts/root";

export default function AllBlogPostsClient({
	blogPosts,
}: {
	blogPosts: {
		meta: {
			path: string;
			fileName: string;
			fileExtension: string;
		};
		data: {
			[x: string]: unknown;
			title: string;
			description: string;
			date: string;
			author: string;
		};
		content: string;
	}[];
}) {
	return (
		<RootLayout
			metadata={{
				title: "Brösel – the bun fullstack framework",
				description:
					"Brösel is a minimal fullstack framework for building web applications with React and Bun.",
			}}
			props={{ blogPosts }}
			path="blog-all"
		>
			<div>All Blog Posts</div>
			{blogPosts.map((blogPost) => (
				<div key={blogPost.meta.path}>
					<h2>{blogPost.data.title}</h2>
					<p>{blogPost.data.description}</p>
				</div>
			))}
		</RootLayout>
	);
}
