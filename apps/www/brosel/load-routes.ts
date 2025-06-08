import { z } from "zod";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function getRoutes(): Promise<
	{
		path: string;
		handler: Partial<
			Record<HttpMethod, (req: Request) => Response | Promise<Response>>
		>;
	}[]
> {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: `${process.cwd()}/src/routes`,
	});

	const routes: {
		path: string;
		handler: Partial<
			Record<HttpMethod, (req: Request) => Response | Promise<Response>>
		>;
	}[] = [];

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

		routes.push({
			path: route.path,
			handler: route.routes,
		});
	}

	return routes;
}
