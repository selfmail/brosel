import { load, render } from "brosel";
import { useState } from "react";
import RootLayout from "../layouts/root";

export default load({
	handler: async (req) => {
		const demo =
			"The following text comes from the server – it's rendered on the server and sent to the client. You can include in this text files, cookies and way more.";

		const res = await fetch("http://localhost:3000/api/demo");

		if (!res.ok) {
			throw new Error("Failed to fetch demo text");
		}

		const text = await res.text();

		const defaultValue = 10;

		return await render({
			component: (
				<Component demo={demo} text={text} defaultValue={defaultValue} />
			),
			props: { demo, text },
		});
	},
});

export const Component = ({
	demo,
	text,
	defaultValue,
}: { demo: string; text: string; defaultValue: number }) => {
	const [count, setCount] = useState(defaultValue);

	return (
		<RootLayout
			metadata={{
				title: "Brosel",
				description:
					"Brosel is a modern framework for building web applications with React and Bun.",
			}}
			props={{ demo, text, defaultValue }}
			path="index"
			className="flex items-center justify-center"
		>
			<div className="lg:w-[500px] lg:pt-24 flex flex-col space-y-12">
				<div className="flex flex-col space-y-6">
					<h1 className="text-xl font-medium">Brösel</h1>
					<p>
						Brösel is a minimal fullstack framework for building web
						applications with React and Bun. To get started, create a new
						project with <code>bun create brosel</code>!
					</p>
				</div>
				<div className="flex-col flex space-y-6">
					<h2 className="text-lg font-medium">A little SSR demonstration</h2>
					<p>{demo} We can also fetch data from the server, for example:</p>
					<div className="flex items-center space-x-4">
						<code>GET /api/demo</code>
						<p>{text}</p>
					</div>
				</div>
				<div className="flex flex-col space-y-6">
					<h2 className="text-lg font-medium">Counter</h2>
					<p>
						This is a counter, that's rendered on the client. You can give it a
						default value from the server.
					</p>
					<div className="flex items-center justify-between">
						<p>Count: {count}</p>
						<button
							className="border border-neutral-200 px-2 py-0.5 rounded-md cursor-pointer"
							onClick={() => setCount(count + 1)}
						>
							Increment Counter
						</button>
					</div>
				</div>
				<a
					href="https://brosel.henri.is/docs"
					target="_blank"
					className="border no-underline border-neutral-200 p-4 rounded-xl flex flex-col space-y-3"
					rel="noreferrer"
				>
					<h2>Get started</h2>
					<p>Learn how to create your first pages with Brösel!</p>
				</a>
			</div>
		</RootLayout>
	);
};
