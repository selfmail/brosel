import { type BundledLanguage, codeToHtml } from "shiki";

export default async function Code({
	code,
	lang,
}: {
	code: string;
	lang?: BundledLanguage;
}) {
	const html = await codeToHtml(code, {
		lang: lang ?? "typescript",
		theme: "github-dark",
	});

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
