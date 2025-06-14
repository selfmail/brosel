import { z } from "zod";
import { getConfig } from "../config/get-config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function loadProductionRoutes() {
	const config = await getConfig();
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: `${process.cwd()}/${config.routesDir}`,
	});

	const routes = new Map<
		string,
		Partial<Record<HttpMethod, (req: Request) => Response | Promise<Response>>>
	>();

	for await (const [path] of Object.entries(router.routes)) {
		const importPath = `${process.cwd()}/src/routes${path}.ts`;

		const mod = await import(importPath);

		const route = mod.default as {
			path: string;
			routes: Partial<
				Record<HttpMethod, (req: Request) => Response | Promise<Response>>
			>;
		};

		const handlerSchema = z.object({
			GET: z.function().args(z.instanceof(Request)).returns(z.any()).optional(),
			POST: z
				.function()
				.args(z.instanceof(Request))
				.returns(z.any())
				.optional(),
			PUT: z.function().args(z.instanceof(Request)).returns(z.any()).optional(),
			DELETE: z
				.function()
				.args(z.instanceof(Request))
				.returns(z.any())
				.optional(),
		});

		const routeSchema = await z
			.object({
				path: z.string(),
				routes: handlerSchema,
			})
			.safeParseAsync(route);

		if (!routeSchema.success) {
			console.log(routeSchema.error.issues);
			throw new Error("Failed to parse route");
		}

		routes.set(route.path, route.routes);
	}

	const routesObject = Object.fromEntries(
		Array.from(routes).map((route) => [route[0], route[1]]),
	);

	return routesObject;
}
