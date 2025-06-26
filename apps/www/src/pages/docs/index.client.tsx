import HomeLayout from "@/layouts/home";

export default function DocsPage({ script }: { script: string }) {
	return (
		<HomeLayout script={script} props={{ script }}>
			Docs!
		</HomeLayout>
	);
}
