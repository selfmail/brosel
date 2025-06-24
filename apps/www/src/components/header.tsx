export default function Header() {
	return (
		<div className="flex items-center py-6 lg:w-[900px] justify-between">
			<h3>Brösel</h3>
			<nav className="flex items-center space-x-4 *:text-[#ddd]">
				<a href="/docs">Docs</a>
				<a href="/docs">Changelog</a>
				<a href="/docs">Github</a>
			</nav>
		</div>
	);
}
