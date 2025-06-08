export function Props({
	props,
}: {
	props: Record<string, unknown>;
}) {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `window.__INITIAL_PROPS__ = ${JSON.stringify(props)}`,
			}}
		/>
	);
}
