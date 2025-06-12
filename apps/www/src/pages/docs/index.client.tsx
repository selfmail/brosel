import Markdown from "react-markdown";
import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default function DocsComponent({
	title,
	description,
	author,
	content,
}: {
	title: string;
	description: string;
	author: string;
	content: string;
}) {
	return (
		<RootLayout
			metadata={{
				title: title,
				description: `${description} - written by ${author}`,
			}}
			props={{ title, author, description, content }}
			path="docs"
			className="flex items-center justify-center"
		>
			<div className="lg:w-[600px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<div className="flex flex-col space-y-3">
					<h2 className="text-lg font-medium">{title}</h2>
					<p>
						{description} - written by {author}
					</p>
				</div>
				<div className="flex flex-col space-y-3">
					<Markdown>{content}</Markdown>
				</div>
			</div>
		</RootLayout>
	);
}
