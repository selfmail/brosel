import type { RoutePath } from "../../.brosel/routes";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function useAction<T extends HTTPMethod | undefined>(
	method: T,
	url: RoutePath,
	body: T extends "POST" ? Record<string, unknown> : never,
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
