import { usePathname } from "../hooks/use-pathname";

export default function Header() {
	const pathname = usePathname();
	console.log(pathname);
	return (
		<header className="flex items-center justify-between py-4 px-8 absolute top-0 left-0 right-0 z-10">
			<div className="flex space-x-3 items-center">
				<a href="/" className="text-lg font-medium">
					Brösel
				</a>
				<a
					className={`${pathname === "/" ? "text-black" : "text-neutral-500"} ml-6`}
					href="/"
				>
					Home
				</a>
				<a
					href="/docs"
					className={`${pathname === "/docs" ? "text-black" : "text-neutral-500"}`}
				>
					Docs
				</a>
			</div>
		</header>
	);
}
