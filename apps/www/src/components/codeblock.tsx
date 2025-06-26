import Code from "./code";

export default function CodeBlock({
	className,
	code,
	file,
}: {
	className?: string;
	code: string;
	file?: string;
}) {
	return (
		<div
			className={`flex border border-neutral-800 flex-col w-full rounded-lg ${className}`}
		>
			<div className="p-2 flex space-x-3 items-center bg-neutral-900 rounded-t-lg">
				<p>{file}</p>
			</div>
			<Code className="rounded-b-lg p-2 bg-[#101010]" code={code} lang="ts" />
		</div>
	);
}
