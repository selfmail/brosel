interface RootLayoutProps extends React.HTMLAttributes<HTMLBodyElement> {
	metadata: {
		title: string;
		description: string;
	};
	props: Record<string, unknown>;
	path: string;
}

export default function RootLayout({
	metadata,
	props,
	path,
	...bodyProps
}: RootLayoutProps) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="stylesheet" href="/assets/styles.css" />
				<title>{metadata.title}</title>
			</head>
			<body {...bodyProps}>
				{bodyProps.children}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__INITIAL_PROPS__ = ${JSON.stringify(props)}`,
					}}
				/>
				<script
					src={`/scripts/client${path === "" ? "" : `-${path}`}.js`}
				></script>
			</body>
		</html>
	);
}
