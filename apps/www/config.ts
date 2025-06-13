import { z } from "zod/v4";
import config from "./brosel/config";

export default config({
	tailwind: false,
	devDir: ".brosel",

	markdown: {
		blog: {
			path: "./src/blog",
			extension: "md",
			frontmatter: {
				title: z.string(),
				description: z.string(),
				date: z.date(),
				author: z.string(),
			},
		},
		docs: {
			path: "./src/docs",
			extension: "md",
			frontmatter: {
				title: z.string(),
				description: z.string(),
				author: z.string(),
			},
		},
	},
	secutiry: {
		runAuditInProduction: false,
	},
});
