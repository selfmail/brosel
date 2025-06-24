import { z } from "zod/v4";
import config from "./brosel/config";

export default config({
	env: {
		SESSION_SECRET: z
			.string()
			.min(
				32,
				"SESSION_SECRET is required, with a minimum length of 32 characters.",
			),
	},
	secutiry: {
		runAuditInProduction: false,
	},
	markdown: {
		blog: {
			path: "src/blog",
			extension: "md",
			frontmatter: {
				title: z.string(),
				description: z.string(),
				date: z.date(),
				author: z.string(),
			},
		},
		docs: {
			path: "src/docs",
			extension: "md",
			frontmatter: {
				title: z.string(),
				description: z.string(),
				author: z.string(),
			},
		},
	},
});
