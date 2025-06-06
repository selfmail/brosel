import { load, render } from "brosel";

import GitHub from "../icons/github";

import Header from "../components/header";

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
			<div className="min-h-screen flex items-center flex-col space-y-3 justify-center w-full">
				<h1 className="text-5xl font-bold">Your Framework</h1>
				<p>Every piece is customizable, so you can adapt it for your needs.</p>
				<div className="flex space-x-3">
					<button className="" type="button">
						Get Started
					</button>
					<button
						className="px-4 flex space-x-2 items-center py-1 rounded-lg cursor-pointer  transition-all  border border-neutral-200"
						type="button"
					>
						<GitHub />
						<span>Github</span>
					</button>
				</div>
			</div>
		</RootLayout>
	);
};
