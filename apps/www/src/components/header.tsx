import { usePathname } from "../hooks/use-pathname";

export default function Header({ path }: { path: string }) {
	return (
		<header className="flex items-center justify-between py-4 px-16 absolute top-0 left-0 right-0 z-10">
			<div className="flex space-x-3 items-center">
				<a href="/" className="text-lg font-medium">
					Brösel
				</a>
				<a
					className={`${path === "/" ? "text-black" : "text-neutral-500"} ml-6`}
					href="/"
				>
					Home
				</a>
				<a
					href="/docs"
					className={`${path === "/docs" ? "text-black" : "text-neutral-500"}`}
				>
					Docs
				</a>
			</div>
		</header>
	);
}
