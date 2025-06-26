export default function Footer() {
	return (
		<footer className="py-6 flex space-y-4 lg:space-y-0 lg:w-[900px] flex-col lg:flex-row lg:justify-between">
			<div className="flex flex-col space-y-2">
				<h3>Brösel</h3>
				<p className="text-sm text-[#555]">
					A{" "}
					<a
						className="text-[#ddd] hover:text-[#fff] transition-colors underline"
						href="https://selfmail.app"
						target="_blank"
						rel="noreferrer"
					>
						Selfmail
					</a>{" "}
					project.
				</p>
			</div>
			<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
				<div className="flex flex-col space-y-2">
					<p className="text-sm text-[#555]">Internal</p>
					<a href="/docs">Docs</a>
					<a href="/blog">Blog</a>
					<a href="/examples">Examples</a>
					<a href="/changelog">Changelog</a>
				</div>
				<div className="flex flex-col space-y-2">
					<p className="text-sm text-[#555]">Community</p>
					<a
						href="https://github.com/selfmail/brosel"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
				</div>
			</div>
		</footer>
	);
}
