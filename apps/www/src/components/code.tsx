import { type BundledLanguage, codeToHtml } from "shiki";

export default async function Code({
	code,
	lang,
	className,
}: {
	code: string;
	lang?: BundledLanguage;
	className?: string;
}) {
	const html = await codeToHtml(code, {
		lang: lang ?? "typescript",
		theme: "github-dark",
	});

	return (
		<div className={className} dangerouslySetInnerHTML={{ __html: html }} />
	);
}
