import { load, render } from "brosel";
import RootLayout from "../../layouts/root";

export default load({
	path: "/docs/*",
	handler: async () => {
		return await render({
			component: <Component text="Hello" />,
			props: { text: "Hello" },
		});
	},
});

export const Component = ({ text }: { text: string }) => {
	return (
		<RootLayout
			metadata={{
				title: "Brösel",
				description:
					"Brösel is a modern framework for building web applications with React and Bun.",
			}}
			props={{ text }}
			path="docs"
			className="flex items-center justify-center"
		>
			<div className="lg:w-[500px] lg:pt-24 flex flex-col space-y-12">hey</div>
		</RootLayout>
	);
};
