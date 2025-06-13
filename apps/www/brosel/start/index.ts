import { rm } from "node:fs/promises";
import { $ } from "bun";
import chalk from "chalk";
import consola from "consola";
import ora from "ora";
import { getConfig } from "../config/get-config";
import { getMarkdownFiles } from "../markdown";
import { compileProductionPages } from "./pages";
import { checkForRequiredDirectories } from "./utils";

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
		await $`bunx @tailwindcss/cli -i ${process.cwd()}/${config.globalCSS} -o ${process.cwd()}/.brosel/out.css`;
	if (code.exitCode !== 0) {
		console.error("TailwindCSS failed to compile.");
		process.exit(1);
	}
}

if (config.markdown) {
	await getMarkdownFiles();
}

spinner.text = "Checking for required directories...";
await checkForRequiredDirectories();

spinner.text = "Compiling pages...";
const pages = await compileProductionPages();

spinner.stop();

console.log(`
${chalk.blue(`Started production server on http://localhost:${process.env.PORT || 3000}`)}
${chalk.grey("The production server is not recommended for development.")}    
`);
