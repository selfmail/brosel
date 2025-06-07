export default function ColoredText({ text }: { text: string }) {
	const colors = [
		"#FF6B6B", // Coral Red
		"#4ECDC4", // Turquoise
		"#45B7D1", // Sky Blue
		"#96CEB4", // Sage Green
		"#D4A5A5", // Dusty Rose
	];
	return (
		<>
			{text.split("").map((char, index) => (
				<span
					key={`${char}-${index.toString()}`}
					style={{ color: colors[index % colors.length] }}
				>
					{char}
				</span>
			))}
		</>
	);
}
