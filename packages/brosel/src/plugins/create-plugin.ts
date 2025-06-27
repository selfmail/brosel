import type { BunRequest } from "bun";
import type { Config } from "../config";

/**
 * Config object which must be returned from the `onDevelopmentStart` function.
 */
type DevelopmentStartConfig = {
	files: string[];
	folders: string[];
	rerun?: (files: string[]) => void | Promise<void>;
};

export type Plugin = {
	/**
	 * The name of your plugin, used for logging and identification.
	 */
	name: string;
	/**
	 * A function which will be runned if declared on every request. If `undefined` is returned, the request will continue as normal.
	 * If a `Response` is returned, it will be used as the response for the request. If a `Promise` is returned, it will be awaited
	 * before continuing. Think of a middleware function which can modify the request or response. This function will be called
	 * before any other middleware is executed.
	 */
	onRequest?: (
		request: BunRequest,
	) => undefined | Response | Promise<undefined | Response>;
	/**
	 * This function will be called when you start the server in production mode. You can modify the file system, create
	 * directories, or do any other setup you need for your plugin. This function will not be called in development mode.
	 */
	onProductionStart?: (config: Config) => void | Promise<void>;
	/**
	 * This function will be called when you start the development server. As in the `onProductionStart` function, you can
	 * modify the file system, create directories, or do any other setup you need for your plugin. You can return an array
	 * of files to listen to, when they chagne the function get's rerunned. You can also speicify a custom "rerun" function,
	 * which will be triggered on a file-systen change.
	 */
	onDevelopmentStart?: (
		config: Config,
		isRerun: boolean,
	) => DevelopmentStartConfig | Promise<DevelopmentStartConfig>;
};
