import { rm } from "node:fs/promises";
import { $ } from "bun";
import chalk from "chalk";
import consola from "consola";
import ora from "ora";
import { z } from "zod";
import { getConfig } from "../config/get-config";
import { checkEnv } from "../env";
import { getMarkdownFiles } from "../markdown";
import { loadProductionAssets } from "./assets";
import { loadProductionPages } from "./pages";
import { loadProductionRoutes } from "./routes";
import { loadProductionClientScripts } from "./scripts";
import { checkForRequiredDirectories } from "./utils";

globalThis.scriptPath = {};
globalThis.dev = false;

const config = await getConfig();

const spinner = ora("Deleting old cache files...").start();

await rm(`${process.cwd()}/${config.devDir}`, {
	recursive: true,
	force: true,
});

if (config.secutiry.runAuditInProduction) {
	spinner.text = "Running security audit...";
	const audit = await $`bun audit --json`.nothrow().quiet();
	const auditText = audit.text();

	// if audit failed, exit with error, message the user to run bun audit
	if (auditText === "{}" || audit.exitCode !== 0) {
		consola.error(
			"Security audit failed. Please run `bun audit` to fix the issues.",
		);
		process.exit(1);
	}
}

if (config.tailwind) {
	spinner.text = "Compiling TailwindCSS...";
	const code =
		await $`bunx @tailwindcss/cli -i ${process.cwd()}/${config.globalCSS} -o ${process.cwd()}/.brosel/out.css`
			.nothrow()
			.quiet();

	if (code.exitCode !== 0) {
		console.error("TailwindCSS failed to compile.");
		process.exit(1);
	}
}

if (config.markdown) {
	await getMarkdownFiles();
}

spinner.text = "Checking env variables...";
await checkEnv();

spinner.text = "Checking for required directories...";
await checkForRequiredDirectories();

spinner.text = "Compiling routes...";

const pagesObject = await loadProductionPages();
const scriptsObject = await loadProductionClientScripts();
const routesObject = await loadProductionRoutes();
const assetsObject = await loadProductionAssets();

spinner.stop();

const serverConf = await import(`${process.cwd()}/src/index.ts`);

if (!serverConf.default) {
	consola.error(
		"The default export in src/index.ts is not a function. It must return the server() function.",
	);
	process.exit(1);
}

const serverConfSchema = await z
	.object({
		port: z.number().optional(),
		hostname: z.string().optional(),
		routes: z.record(z.string(), z.any()).optional(),
		error: z.any(),
	})
	.safeParseAsync(serverConf.default);

if (!serverConfSchema.success) {
	console.log(serverConfSchema.error.issues);
	throw new Error("Failed to parse server options");
}

const serverOptions = serverConfSchema.data;

const server = Bun.serve({
	port: serverOptions.port ?? 3000,
	hostname: serverOptions.hostname ?? "0.0.0.0",
	error: (err) => {
		return new Response(err.message);
	},
	routes: {
		...pagesObject,
		...scriptsObject,
		...routesObject,
		...assetsObject,
		...serverOptions.routes,
	},
});

console.log(`
${chalk.blue(`Started production server on http://localhost:${server.port || 3000}`)}
${chalk.grey("The production server is not recommended for development.")}    
`);
