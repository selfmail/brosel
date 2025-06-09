import Header from "../../components/header";
import RootLayout from "../../layouts/root";

export default function ExampleComponent() {
	return (
		<RootLayout
			metadata={{
				title: "Brösel",
				description:
					"Brösel is a modern framework for building web applications with React and Bun.",
			}}
			props={{}}
			path="docs"
			className="flex items-center justify-center"
		>
			<div className="lg:w-[500px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<p>hey examples!</p>
			</div>
		</RootLayout>
	);
}
