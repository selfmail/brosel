export {};
declare global {
	var dev: boolean;
	var server: Bun.ServeFunction<unknown, object> | undefined;
	var scriptPath: Record<string, string>;
}
