export default function HomeLayout({
	script,
	children,
	props,
}: {
	script: string;
	props: Record<string, unknown>;
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Brösel</title>
				<link rel="stylesheet" href="/assets/styles.css" />
				<script src={script} />
			</head>
			{children}
		</html>
	);
}
