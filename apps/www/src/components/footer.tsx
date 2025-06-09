import ColoredText from "./colored-text";

export default function Footer() {
	return (
		<footer className="bg-neutral-100 flex justify-between rounded-xl p-4 mb-24">
			<h2 className="text-base font-medium">
				<ColoredText text="Brösel" />
			</h2>
			<div className="flex flex-col space-y-3">
				<a href="/docs" className="underline">
					Docs
				</a>
				<a href="/blog" className="underline">
					Blog
				</a>
				<a href="/examples" className="underline">
					Examples
				</a>
				<a href="https://github.com/i-am-henri/brosel" className="underline">
					Github
				</a>
			</div>
		</footer>
	);
}
