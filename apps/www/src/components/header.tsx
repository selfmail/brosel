import { usePathname } from "../hooks/use-pathname";

export default function Header() {
	return (
		<header className="flex items-center justify-between">
			<a href="/" className="text-black">
				<h2 className="text-base font-medium text-black">Brösel</h2>
			</a>
			<nav className="space-x-3">
				<a href="/docs">Docs</a>
				<a href="/blog">Blog</a>
				<a href="https://github.com/i-am-henri/brosel">Github</a>
			</nav>
		</header>
	);
}
