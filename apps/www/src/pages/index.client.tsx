/// <reference lib="dom" />
import CodeBlock from "@/components/codeblock";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serverEntryExample } from "@/examples";
import { AtomIcon, ComputerIcon, FolderIcon } from "lucide-react";
import HomeLayout from "../layouts/home";

function RightStar({ className }: { className?: string }) {
	return (
		<div
			className={`flex translate-x-[-1px] z-50 translate-y-[1px] items-center justify-center ${className}`}
		>
			<div className="bg-[#aaa] h-0.5 w-5 absolute" />
			<div className="bg-[#aaa] h-0.5 w-5 rotate-90 absolute" />
		</div>
	);
}

function LeftStar({ className }: { className?: string }) {
	return (
		<div
			className={`flex translate-[1px] z-50 items-center justify-center ${className}`}
		>
			<div className="bg-[#aaa] h-[2px] w-5 absolute" />
			<div className="bg-[#aaa] h-[2px] w-5 rotate-90 absolute" />
		</div>
	);
}

export default function Home() {
	return (
		<HomeLayout props={{}}>
			<body className="h-full flex flex-col items-center pt-6 w-full bg-neutral-950 text-white">
				<Header />
				<div className="relative lg:w-[900px] space-y-12">
					{/* Hero Section */}
					<section className="border-2  border-neutral-800 h-[700px] relative">
						<RightStar className="absolute  -top-0.5 -right-0.5 z-20" />
						<LeftStar className="absolute  -top-0.5 -left-0.5 z-20" />
						<RightStar className="absolute bottom-0 -right-0.5 z-20" />
						<LeftStar className="absolute bottom-0 -left-0.5 z-20" />
						<div className="space-y-4 flex-col z-10 flex items-center justify-center h-full">
							<Badge>Announcing first public release!</Badge>
							<h1 className="text-4xl text-center font-medium lg:max-w-[50%]">
								Your framework.
								<br />
								Local in your project.
							</h1>
							<p className="text-sm lg:max-w-[50%] text-center text-[#ddd]">
								Brösel is a framework for building web applications with a focus
								on simplicity and performance.
							</p>
							<div className="flex items-center space-x-3">
								<Button variant={"default"} size={"sm"}>
									Start crafting
								</Button>
								<Button variant={"secondary"} size={"sm"}>
									Learn more
								</Button>
							</div>
						</div>
					</section>
					<section className="border-2 grid grid-cols-3 border-neutral-800">
						<div className="border-r-2 border-r-neutral-800 border-dashed space-y-4 p-8">
							<h2 className="text-lg text-blue-200 font-medium flex items-center space-x-2">
								<ComputerIcon size={14} />
								<span>SSR</span>
							</h2>
							<p>
								Brösel renders the pages on the server. After that, the
								hydration comes.
							</p>
						</div>
						<div className="border-r-2 border-r-neutral-800 border-dashed space-y-4 p-8">
							<h2 className="text-lg text-blue-200 font-medium flex items-center space-x-2">
								<AtomIcon size={14} />
								<span>React</span>
							</h2>
							<p>
								Use React, Solid or Preact as your frontend library, use Brösel
								to render your logic!
							</p>
						</div>
						<div className="space-y-4 p-8">
							<h2 className="text-lg text-blue-200 font-medium flex items-center space-x-2">
								<FolderIcon size={14} />
								<span>Local</span>
							</h2>
							<p>
								Brösel lives in the <code>brosel</code> folder, right inside
								your project. You can change every line of code.
							</p>
						</div>
					</section>
					<section className="border-2 grid grid-cols-2 border-neutral-800">
						<div className="space-y-4 self-start  sticky top-0 p-8 ">
							<h2 className="text-2xl font-medium">Extendable by default</h2>
							<p>
								Brösel lives in your project – this means you can edit, add or
								remove everything! We also plan to include a plugin system in
								the near future!
							</p>
						</div>
						<div className="flex flex-col border-l-2 border-dashed border-l-neutral-800 divide-y-2 divide-dashed divide-neutral-800">
							<div className="flex flex-col space-y-2 p-8">
								<h3 className="text-lg font-medium">Authentication</h3>
								<p>
									Some basic authentication methods to get started. You can
									configure the server aspect in api routes, you can use your
									own database or a local saving method!
								</p>
							</div>
							<div className="flex flex-col space-y-2 p-8">
								<h3 className="text-lg font-medium">Markdown</h3>
								<p>
									Brösel has a built-in markdown support, with hot reloading,
									frontmatter parsing and the option to render the markdown with
									react.
								</p>
							</div>
							<div className="flex flex-col space-y-2 p-8">
								<h3 className="text-lg font-medium">Hooks</h3>
								<p>
									Use prebuilt react hooks, to get started even faster. For
									example, a path hook, action hook (for a typesafe option to
									mutate data with the api routes) and a form hook.
								</p>
							</div>
							<div className="flex flex-col space-y-2 p-8">
								<h3 className="text-lg font-medium">Analytics</h3>
								<p>
									Brösel has a built-in analytics support, with major Providers
									like posthog. You can track page views, server side event and
									more.
								</p>
							</div>
							<div className="flex flex-col space-y-2 p-8">
								<h3 className="text-lg font-medium">Errors</h3>
								<p>
									Track and handle errors easily – for example with a custom
									error api, error pages and tracking methods. You can use
									providers like sentry, integrate or create your owns and more.
								</p>
							</div>
						</div>
					</section>
					<section className="border-2 flex flex-col divide-y divide-neutral-800 border-neutral-800 lg:w-[900px]">
						<div className="flex flex-col p-8 space-y-4">
							<h2 className="text-2xl font-medium">Ship really fast</h2>
							<p>
								Just create a simple server entry for every page. The page is
								going to be generated on the server, so you have to pass the
								component to the function.
							</p>
							<CodeBlock code={serverEntryExample} file="index.ts" />
						</div>
					</section>
				</div>
				<Footer />
			</body>
		</HomeLayout>
	);
}
