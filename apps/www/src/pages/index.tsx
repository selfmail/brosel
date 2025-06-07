import { load, render } from "brosel";

import GitHub from "../icons/github";

import Header from "../components/header";

import { ArrowRight } from "lucide-react";

import RootLayout from "../layouts/root";

export default load({
	handler: async () => {
		return await render({
			component: <Component />,
			props: {},
		});
	},
});
export const Component = () => {
	return (
		<RootLayout
			metadata={{
				title: "Brösel – the bun fullstack framework",
				description:
					"Brösel is a minimal fullstack framework for building web applications with React and Bun.",
			}}
			props={{}}
			path="index"
		>
			<Header />
			<div className="h-[80vh] flex items-center flex-col space-y-3 justify-center w-full">
				<h1 className="text-5xl font-bold">Your Framework</h1>
				<p>Every piece is customizable, so you can adapt it for your needs.</p>
				<div className="flex space-x-3">
					<button
						className="px-4 flex space-x-2 items-center py-1 rounded-lg cursor-pointer  transition-all  border border-neutral-200 hover:bg-neutral-100"
						type="button"
					>
						Get Started
					</button>
					<a
						href="http://github.com/i-am-henri/brosel"
						target="_blank"
						rel="noreferrer"
					>
						<button
							className="px-4 group flex space-x-2 items-center py-1 rounded-lg cursor-pointer  transition-all hover:bg-neutral-100"
							type="button"
						>
							<GitHub />
							<span>Github</span>
							<ArrowRight className="size-4 text-[#555] opacity-0 group-hover:translate-x-[2px] group-hover:opacity-100 group-focus-visible:translate-x-[2px] group-focus-visible:opacity-100  duration-300" />
						</button>
					</a>
				</div>
			</div>
			<div className="h-[40vh] flex flex-row justify-center w-full lg:px-12">
				<div className="flex space-y-3 flex-col rounded-xl border p-4">
					<h2 className="text-xl">Typesafe</h2>
					<p>
						Brösel is a minimal fullstack framework for building web
						applications with React and Bun. To get started, create a new
						project with <code>bun create brosel</code>!
					</p>
				</div>
			</div>
		</RootLayout>
	);
};
