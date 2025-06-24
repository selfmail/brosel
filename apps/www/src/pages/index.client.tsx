import Header from "@/components/header";
import { Button } from "@/components/ui/button";
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

export default function Home({
	script,
}: {
	script: string;
}) {
	return (
		<HomeLayout script={script} props={{ script }}>
			<body className="h-full flex flex-col items-center py-6 w-full bg-neutral-950 text-white">
				<Header />
				<div className="relative lg:w-[900px] space-y-12">
					{/* Hero Section */}
					<section className="border-2  border-neutral-800 h-[700px] relative">
						<RightStar className="absolute  -top-0.5 -right-0.5 z-20" />
						<LeftStar className="absolute  -top-0.5 -left-0.5 z-20" />
						<RightStar className="absolute bottom-0 -right-0.5 z-20" />
						<LeftStar className="absolute bottom-0 -left-0.5 z-20" />
						<div className="space-y-4 flex-col z-10 flex items-center justify-center h-full">
							<h1 className="text-4xl text-center font-medium lg:max-w-[50%]">
								You framework.
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
						<div className="border-r-2 border-r-neutral-800">
							<h2 className="text-lg font-medium">The local framework</h2>
						</div>
						<div>hey</div>
						<div>hey</div>
					</section>
					<section className="border-2 grid grid-cols-2 border-neutral-800">
						<div className="space-y-4 sticky top-0 p-8 border-r-2 border-dashed border-r-neutral-800">
							<h2 className="text-2xl font-medium">Extendable by default</h2>
							<p>
								Brösel lives in your project – this means you can edit, add or
								remove everything!
							</p>
						</div>
						<div className="flex flex-col divide-y-2 divide-dashed divide-neutral-800">
							<div className="flex items-center p-8">
								<h3 className="text-lg font-medium">Built-in features</h3>
							</div>
							<div className="flex items-center p-8">
								<h3 className="text-lg font-medium">Extensible</h3>
							</div>
							<div className="flex items-center p-8">
								<h3 className="text-lg font-medium">Local in your project</h3>
							</div>
						</div>
					</section>
				</div>
			</body>
		</HomeLayout>
	);
}
