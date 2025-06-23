import HomeLayout from "../layouts/home";

function RightStar({ className }: { className?: string }) {
	return (
		<div
			className={`flex translate-x-[-1px] translate-y-[1px] items-center justify-center ${className}`}
		>
			<div className="bg-white h-0.5 w-5 absolute" />
			<div className="bg-white h-0.5 w-5 rotate-90 absolute" />
		</div>
	);
}
function LeftStar({ className }: { className?: string }) {
	return (
		<div
			className={`flex translate-[1px] items-center justify-center ${className}`}
		>
			<div className="bg-white h-0.5 w-5 absolute" />
			<div className="bg-white h-0.5 w-5 rotate-90 absolute" />
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
			<body className="h-full flex justify-center w-full bg-neutral-950 text-white">
				<div className="lg:w-[900px] relative py-24">
					<RightStar className="absolute top-24 right-0 z-20" />
					<LeftStar className="absolute top-24 left-0 z-20" />
					<RightStar className="absolute bottom-24 right-0 z-20" />
					<LeftStar className="absolute bottom-24 left-0 z-20" />
					<section
						className="border-2 border-neutral-600 h-[800px] relative overflow-hidden"
						style={{ position: "relative" }}
					>
						<div className="relative z-10 flex items-center justify-center h-full">
							<h1 className="text-4xl text-center font-medium">
								You framework.
								<br />
								The Brösel framework.
							</h1>
						</div>
					</section>
				</div>
			</body>
		</HomeLayout>
	);
}
