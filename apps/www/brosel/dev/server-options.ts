import type { BunRequest } from "bun";
import { z } from "zod";

type RouteHandler<Path extends string> = (
	req: BunRequest<Path>,
) => Response | Promise<Response>;

type ServerOptions<T extends Record<string, RouteHandler<string>>> = {
	port: number;
	hostname?: string;
	routes: {
		[K in keyof T]: RouteHandler<K & string>;
	};
	error: (err: { message: string; code?: number }) =>
		| Response
		| Promise<Response>;
};

// Magie passiert hier: T wird konstant eingefroren
export function server<const T extends Record<string, RouteHandler<string>>>(
	options: ServerOptions<T>,
) {
	return options;
}

// Define the server schema
export const ServerSchema = z.object({
	port: z.number().optional(),
	hostname: z.string().optional(),
	routes: z.record(z.string(), z.any()).optional(),
	error: z.any(),
});
