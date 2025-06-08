import { load, render } from "brosel";
import { blog } from "../..";
import ColoredText from "../../components/colored-text";
import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default load({
	path: "/blog",
	handler: async () => {
		const articles = blog.files;
		return await render({
			component: <Component articles={articles} />,
			props: { articles },
		});
	},
});

export const Component = ({
	articles,
}: {
	articles: {
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
}) => {
	return (
		<RootLayout
			metadata={{
				title: "Brösel – the bun fullstack framework",
				description:
					"Brösel is a minimal fullstack framework for building web applications with React and Bun.",
			}}
			props={{ articles }}
			path="blog"
			className="flex justify-center w-full min-h-screen"
		>
			<div className="lg:w-[600px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<div className="flex flex-col space-y-3">
					<h2 className="text-lg font-medium">The Brösel Blog</h2>
					<p>Articles, Changes and Tutorials!</p>
				</div>

				<footer className="bg-neutral-100 flex justify-between rounded-xl p-4 mb-24">
					<h2 className="text-base font-medium">
						<ColoredText text="Brösel" />
					</h2>
					<div className="flex flex-col space-y-3">
						<a href="/docs" className="underline">
							Docs
						</a>
						<a href="/blog" className="underline">
							Blog
						</a>
						<a href="/examples" className="underline">
							Examples
						</a>
						<a
							href="https://github.com/i-am-henri/brosel"
							className="underline"
						>
							Github
						</a>
					</div>
				</footer>
			</div>
		</RootLayout>
	);
};
