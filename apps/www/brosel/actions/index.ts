import { type BunRequest, Glob } from "bun";
import consola from "consola";
import { z } from "zod/v4";
import type { RoutePath } from "../../.brosel/routes";
import { getConfig } from "../config/get-config";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function generateRoutePath() {
	const glob = new Glob("**/*.ts");
	const config = await getConfig();
	const routes = new Set<string>();

	for await (const file of glob.scan(`${process.cwd()}/${config.routesDir}`)) {
		if (!file.endsWith(".ts")) continue;
		const routeObject = await import(
			`${process.cwd()}/${config.routesDir}/${file}`
		);

		if (!(routeObject.default && typeof routeObject.default === "object"))
			continue;

		const route = routeObject.default as {
			path: string;
			handler: {
				[key in HTTPMethod]: (
					request: BunRequest<string>,
				) => Response | Promise<Response>;
			};
		};

		const parse = await z
			.object({
				path: z.string(),
				routes: z.record(z.enum(["GET", "POST", "PUT", "DELETE"]), z.any()),
			})
			.safeParseAsync(route);

		if (!parse.success) {
			consola.error(
				`Invalid route in ${file}: ${z.prettifyError(parse.error)}`,
			);
			continue;
		}

		routes.add(route.path);
	}

	const content = `// This file is auto-generated. Do not edit it manually.
export type RoutePath = ${
		Array.from(routes).length > 0
			? Array.from(routes)
					.map((route) => `'${route}'`)
					.join(" | ")
			: "never"
	};
`;

	await Bun.write(`${process.cwd()}/${config.devDir}/routes.ts`, content);
}

export async function action<T extends HTTPMethod | undefined>(
	method: T,
	url: RoutePath,
	body: T extends "POST" ? Record<string, unknown> : undefined,
) {
	const res = await fetch(url, {
		method: method ?? "GET",
		headers: {
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		throw new Error(
			`Request failed with status ${res.status}. Please try again.`,
		);
	}

	const contentType = res.headers.get("Content-Type");
	if (contentType?.includes("application/json")) {
		return (await res.json()) as T extends "POST"
			? Record<string, unknown>
			: unknown;
	}

	if (contentType?.includes("text/plain")) {
		return (await res.text()) as T extends "POST"
			? Record<string, unknown>
			: unknown;
	}
}
