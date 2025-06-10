export {};
declare global {
	var dev: boolean;
	var server: Bun.ServeFunction<unknown, object> | undefined;
}
