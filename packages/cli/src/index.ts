import {
	cancel,
	confirm,
	group,
	intro,
	multiselect,
	outro,
	select,
	tasks,
	text,
} from "@clack/prompts";
import { $ } from "bun";
import { defineCommand, runMain, showUsage } from "citty";

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
			},
			{
				// On Cancel callback that wraps the group
				// So if the user cancels one of the prompts in the group this function will be called
				onCancel: ({ results }) => {
					cancel("Operation cancelled. Bye bye!");
					process.exit(0);
				},
			},
		);

		// run the tasks to create the project
		await tasks([
			{
				title: "Create new bun project.",
				task: async (message) => {
					await $`bun init ${args.name} -y`;
					// Do installation here
					return "New bun project successfully created.";
				},
			},
		]);
	},
});

runMain(main);
