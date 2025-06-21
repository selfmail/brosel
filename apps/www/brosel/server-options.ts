import type { BunRequest } from "bun";
import { z } from "zod";

type RouteHandler<Path extends string> = (
	req: BunRequest<Path>,
) => Response | Promise<Response>;

type ServerOptions<T extends Record<string, RouteHandler<string>>> = z.infer<
	typeof ServerSchema
> & {
	routes: {
		[K in keyof T]: RouteHandler<K & string>;
	};
	error: (err: { message: string; code?: number }) =>
		| Response
		| Promise<Response>;
};

export function server<const T extends Record<string, RouteHandler<string>>>(
	options: ServerOptions<T>,
) {
	return options;
}

export const ServerSchema = z.object({
	port: z.number().optional(),
	hostname: z.string().optional(),
	routes: z.record(z.string(), z.any()).optional(),
	error: z.any(),
});

function withSecurityHeaders(
	handler: RouteHandler<string>,
): RouteHandler<string> {
	return async (req) => {
		const res = await handler(req);
		const headers = new Headers(res.headers);

		headers.set("Content-Security-Policy", "default-src 'self'");
		headers.set("X-Frame-Options", "DENY");
		headers.set("X-Content-Type-Options", "nosniff");
		headers.set("Referrer-Policy", "no-referrer");
		headers.set(
			"Strict-Transport-Security",
			"max-age=63072000; includeSubDomains; preload",
		);

		return new Response(res.body, {
			status: res.status,
			statusText: res.statusText,
			headers,
		});
	};
}

// Exportiere die Funktion, um sie beim Registrieren der Routen zu verwenden
export { withSecurityHeaders };
