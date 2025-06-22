import Markdown from "react-markdown";
import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default function DocsComponent({
	title,
	description,
	author,
	content,
	files,
}: {
	title: string;
	description: string;
	author: string;
	content: string;
	files: {
		data: {
			title: string;
			description: string;
			author: string;
		};
		content: string;
		meta: {
			path: string;
			fileName: string;
			fileExtension: string;
		};
	}[];
}) {
	return (
		<RootLayout
			metadata={{
				title: title,
				description: `${description} - written by ${author}`,
			}}
			props={{ title, author, description, content }}
			className="flex flex-col items-center justify-center"
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
			<div className="hidden lg:block w-[300px]">
				<h3 className="text-lg font-medium">Documentation:</h3>
				<ul className="list-disc pl-5">
					{files.map((file) => (
						<li key={file.meta.path}>
							<a
								href={`/docs/${file.meta.path}`}
								className="text-blue-500 hover:underline"
							>
								{file.data.title}
							</a>
						</li>
					))}
				</ul>
			</div>
		</RootLayout>
	);
}
