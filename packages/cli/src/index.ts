#!/usr/bin/env bun
import {
	cancel,
	confirm,
	group,
	intro,
	log,
	outro,
	select,
	tasks,
} from "@clack/prompts";
import { $ } from "bun";
import { defineCommand, runMain, showUsage } from "citty";
import { vscodeSettings } from "./templates";

const main = defineCommand({
	meta: {
		name: "Brosel CLI",
		version: "0.0.1",
		description: "Create a new brosel project.",
	},
	args: {
		name: {
			type: "positional",
			description: "Name of the project which will be created.",
			required: true,
		},
	},
	async run({ args, cmd }) {
		console.log("");
		intro("😊 Welcome to the Brosel framework … the bun fullstack framework.");

		/**
		 * Basic project setup. The user can configure the project
		 * first, after that it's getting created with a task.
		 *
		 * TODO: add more options, for example the folder, folder structure, etc.
		 */
		const conf = await group(
			{
				frontendLibrary: () =>
					select({
						message: "Please pick a frontend library!",
						options: [
							{
								value: "react",
								label: "React",
								hint: "little bit bigger size",
							},
							{ value: "solid", label: "SolidJS" },
							{ value: "preact", label: "Preact" },
						],
					}),
				installDeps: () =>
					confirm({
						message: "Should we install the dependencies?",
						initialValue: true,
					}),
				createGitRepo: () =>
					confirm({
						message: "Should we create a git repository and stage the changes?",
						initialValue: true,
					}),
				useBiome: () =>
					confirm({
						message: "Do you want to use biome?",
						initialValue: true,
					}),
			},
			{
				onCancel: ({ results }) => {
					cancel("Operation cancelled. Bye bye!");
					process.exit(0);
				},
			},
		);

		// run the tasks to create the project
		await tasks([
			{
				title: `Cloning the brosel template for ${conf.frontendLibrary}`,
				task: async (message) => {
					const clone =
						await $`bunx gitpick selfmail/brosel/tree/main/templates/${conf.frontendLibrary} ${args.name}`
							.nothrow()
							.quiet();

					if (clone.exitCode !== 0) {
						log.error("Cloning of template failed!");
						process.exit(1);
					}
					return "Template cloned!";
				},
			},
		]);

		if (conf.installDeps) {
			await tasks([
				{
					title: "Installing dependencies",
					task: async (message) => {
						await Bun.sleep(1000);
						const install = await $`cd ${args.name} && bun install`
							.nothrow()
							.quiet();

						if (install.exitCode !== 0) {
							log.info(`${install.stdout}\n${install.stderr}`);
							log.error("Dependencies installation failed!");
							process.exit(1);
						}

						return "Dependencies installed!";
					},
				},
			]);
		}

		if (conf.createGitRepo) {
			await tasks([
				{
					title: "Creating git repository",
					task: async (message) => {
						const install = await $`cd ${args.name} && git init`
							.nothrow()
							.quiet();

						if (install.exitCode !== 0) {
							return "Git repository creation failed! Do you have git installed?";
						}
						return "Git repository created!";
					},
				},
			]);
		}

		if (conf.useBiome) {
			await tasks([
				{
					title: "Installing and configuring biome",
					task: async (message) => {
						const biomeInstall =
							await $`cd ${args.name} && bun add --dev --exact @biomejs/biome`
								.nothrow()
								.quiet();
						if (biomeInstall.exitCode !== 0) {
							log.error("Biome installation failed!");
							process.exit(1);
						}
						message("Installed biome, now creating config file");
						const biomeInit = await $`cd ${args.name} && bunx biome init`
							.nothrow()
							.quiet();
						if (biomeInit.exitCode !== 0) {
							log.error("Biome init failed!");
							process.exit(1);
						}

						await Bun.write(
							`${args.name}/.vscode/settings.json`,
							vscodeSettings,
						);
						return "Biome installed!";
					},
				},
			]);
		}

		outro("🎉 Project created! 🎉");
	},
});

runMain(main);
