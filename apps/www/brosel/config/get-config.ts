import consola from "consola";
import { z } from "zod/v4";
import { ConfigSchema } from ".";

export async function getConfig() {
	const config = await import(`${process.cwd()}/config.ts`);
	if (!config.default) {
		consola.error(
			"No config.ts file found in the root of your project. Please create one and return congig() function from it.",
		);
		process.exit(1);
	}

	const parse = await ConfigSchema.safeParseAsync(config.default);
	if (!parse.success) {
		const prettyError = z.prettifyError(parse.error);
		consola.error(`Config Error: ${prettyError}`);
		process.exit(1);
	}

	return parse.data;
}
