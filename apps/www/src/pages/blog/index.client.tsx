import Footer from "../../components/footer";
import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default function AllBlogPostsClient({
	blogPosts,
	script,
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
			date: Date;
			author: string;
		};
		content: string;
	}[];
	script: string;
}) {
	return (
		<RootLayout
			metadata={{
				title: "Brösel – the bun fullstack framework",
				description:
					"Brösel is a minimal fullstack framework for building web applications with React and Bun.",
			}}
			props={{ blogPosts, script }}
			script={script}
			className="flex items-center justify-center"
		>
			<div className="lg:w-[600px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<div className="flex flex-col space-y-3">
					<h2 className="text-lg font-medium">All blog posts</h2>
					<p>Blogposts about Brösel, Tutorials and Updates.</p>
				</div>
				<div className="flex flex-col space-y-3">
					{blogPosts.map((post) => (
						<a
							href={`/blog/${post.meta.path}`}
							className="flex-row p-3 hover:bg-neutral-50 transition rounded-xl flex justify-between items-start"
							key={post.meta.path}
						>
							<h3 className="text-sm font-bold text-black">
								{post.data.title}
							</h3>
							<p className="text-sm">
								{new Date(post.data.date).toDateString()} by {post.data.author}
							</p>
						</a>
					))}
				</div>
				<Footer />
			</div>
		</RootLayout>
	);
}
