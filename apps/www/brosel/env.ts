import { $ } from "bun";
import consola from "consola";
import { z } from "zod/v4";
import { getConfig } from "./config/get-config";

function zodToTsType(schema: z.ZodTypeAny): string {
	if (schema instanceof z.ZodString) return "string";
	if (schema instanceof z.ZodNumber) return "number";
	if (schema instanceof z.ZodBoolean) return "boolean";
	if (schema instanceof z.ZodEnum)
		return schema.options.map((o) => `"${o}"`).join(" | ");
	if (schema instanceof z.ZodOptional) {
		return `${zodToTsType(schema._def.innerType as z.ZodTypeAny)} | undefined`;
	}
	if (schema instanceof z.ZodNullable) {
		return `${zodToTsType(schema._def.innerType as z.ZodTypeAny)} | null`;
	}
	return "unknown";
}

export async function checkEnv() {
	const config = await getConfig();
	if (!config.env) return;

	const schema = z.object({
		NODE_ENV: z.enum(["development", "production"]).optional(),
		TZ: z.string().optional(),
		...config.env,
	});

	const parse = await schema.safeParseAsync(process.env);
	if (!parse.success) {
		console.error("Environment variable validation failed:", parse.error);
		process.exit(1);
	}

	consola.info("Environment variables validated successfully.");

	const fields = Object.entries(schema.shape).map(([key, zodSchema]) => {
		const schema = zodSchema as z.ZodTypeAny;
		const optional =
			schema instanceof z.ZodOptional ||
			(schema instanceof z.ZodDefault &&
				(schema._def.innerType as z.ZodTypeAny) instanceof z.ZodOptional);

		return `  ${key}${optional ? "?" : ""}: ${zodToTsType(schema)};`;
	});

	const content = `export {};

declare global {
	namespace NodeJS {
		var process: NodeJS.Process & {	
		  ${fields.join("\n          ")}
		};
	}
}
`;

	const outputPath = `${process.cwd()}/${config.devDir}/env.d.ts`;
	await Bun.write(outputPath, content);
}
