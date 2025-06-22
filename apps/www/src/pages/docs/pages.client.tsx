import Markdown from "react-markdown";
import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default function DocsPageComponent({
	doc,
	script,
}: {
	doc: {
		meta: {
			path: string;
			fileName: string;
			fileExtension: string;
		};
		data: {
			title: string;
			description: string;
			author: string;
		};
		content: string;
	};
	script: string;
}) {
	return (
		<RootLayout
			metadata={{
				title: "Brösel",
				description:
					"Brösel is a modern framework for building web applications with React and Bun.",
			}}
			props={{ doc, script }}
			script={script}
			className="flex items-center justify-center"
		>
			<div className="lg:w-[600px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<div className="flex flex-col space-y-3">
					<h2 className="text-lg font-medium">{doc.data.title}</h2>
					<p>
						{doc.data.description} - written by {doc.data.author}
					</p>
				</div>
				<div className="flex flex-col space-y-3">
					<Markdown>{doc.content}</Markdown>
				</div>
			</div>
		</RootLayout>
	);
}
