import ColoredText from "../components/colored-text";
import Footer from "../components/footer";
import Header from "../components/header";
import RootLayout from "../layouts/root";

export default function Component() {
	return (
		<RootLayout
			metadata={{
				title: "Brösel – the bun fullstack framework",
				description:
					"Brösel is a minimal fullstack framework for building web applications with React and Bun.",
			}}
			props={{}}
			path=""
			className="flex justify-center w-full min-h-screen"
		>
			<div className="lg:w-[600px] lg:pt-24 flex flex-col space-y-12">
				<Header />
				<div className="flex flex-col space-y-3">
					<h1 className="text-2xl">
						Brösel is your framework – custimizable in every single function
						without compromises
					</h1>
					<p>
						Brosel lives in your <code>brosel</code> folder, right inside your
						project. You can edit every function, customize it, fix bugs and
						make it your own!
					</p>
				</div>
				<div className="flex flex-col space-y-3">
					<h3 className="text-base font-medium">
						Do we need another framework?
					</h3>
					<p>
						Good Question – maybe. Brösel doesn't overcomplicate things, it's a
						minimal framework. It's not a framework for everyone, it's a
						framework for you. To answer this question: maybe the world doesn't
						need another framework, but maybe you need your own.
					</p>
				</div>
				<div className="flex flex-col space-y-3">
					<h3 className="text-base font-medium">Get Started</h3>
					<p>
						To get started, run <code>bun create brosel</code> inside your
						terminal. You need to install{" "}
						<a
							href="https://bun.sh"
							target="_blank"
							className="underline"
							rel="noreferrer"
						>
							Bun
						</a>{" "}
						for running this command. You can choose your name of the project,
						the frontend library and some other options. After that, the project
						get's created and you can start hacking!
					</p>
				</div>
				<div className="flex flex-col space-y-3">
					<h3 className="font-medium text-base">First steps</h3>
					<p>
						The framework won't be much different to other frameworks like
						nextjs. You place your assets in the <code>assets</code> folder,
						sites in the <code>src/pages</code> folder and api routes in the{" "}
						<code>src/routes</code> folder. All of your pages, assets and routes
						are going to be load into the <code>src/index.ts</code> file, which
						is a file with the bun server (It's using bun's <code>serve()</code>{" "}
						function). To create a new page, create a new file in the{" "}
						<code>src/pages</code> folder and export the <code>load()</code>{" "}
						function from brosel! If you don't specify a custom path, the path
						of the file will be used.
					</p>
				</div>
				<button type="button" onClick={() => alert("Hello World")}>
					<ColoredText text="Get Started"></ColoredText>
				</button>
				<a
					href="/docs"
					className="flex p-4 flex-col border transition-all border-neutral-200 hover:bg-neutral-100 rounded-md"
				>
					<h2 className="text-base text-black font-medium">Learn more</h2>
					<p>Learn more with the Brösel Docs!</p>
				</a>
				<Footer />
			</div>
		</RootLayout>
	);
}
