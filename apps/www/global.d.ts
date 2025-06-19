// IF YOU WANT TO EDIT THIS FILE, YOU NEED TO EDIT `content`-VARIABLE THE `/brosel/env.ts` FILE!
export {};

declare global {
	var dev: boolean;
	var server: Bun.ServeFunction<unknown, object> | undefined;
	var scriptPath: Record<string, string>;

	var process: Omit<NodeJS.Process, "env"> & {
		env: {
	        NODE_ENV?: "development" | "production" | undefined;
            TZ?: string | undefined;
		};
	};
}
