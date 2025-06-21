import {
	createHash,
	pbkdf2Sync,
	randomBytes,
	timingSafeEqual,
} from "node:crypto";
import type { BunRequest } from "bun";

// Password Hashing

const HASH_ITERATIONS = 100_000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha512";

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const hash = pbkdf2Sync(
		password,
		salt,
		HASH_ITERATIONS,
		HASH_KEYLEN,
		HASH_DIGEST,
	).toString("hex");
	return `${salt}$${hash}`;
}

export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [salt, originalHash] = stored.split("$");
	if (!salt || !originalHash) return false;

	const hash = pbkdf2Sync(
		password,
		salt,
		HASH_ITERATIONS,
		HASH_KEYLEN,
		HASH_DIGEST,
	).toString("hex");

	const original = Buffer.from(originalHash, "hex");
	const comparison = Buffer.from(hash, "hex");

	if (original.length !== comparison.length) return false;
	return timingSafeEqual(original, comparison);
}

// Cookie Handling

export function setCookie(
	res: Response,
	name: string,
	value: string,
	options: {
		httpOnly?: boolean;
		secure?: boolean;
		path?: string;
		maxAge?: number;
		sameSite?: "Strict" | "Lax" | "None";
	} = {},
): Response {
	const cookie = [
		`${name}=${encodeURIComponent(value)}`,
		options.httpOnly !== false ? "HttpOnly" : "",
		options.secure !== false ? "Secure" : "",
		options.path ? `Path=${options.path}` : "Path=/",
		options.maxAge ? `Max-Age=${options.maxAge}` : "",
		`SameSite=${options.sameSite || "Strict"}`,
	]
		.filter(Boolean)
		.join("; ");

	res.headers.append("Set-Cookie", cookie);
	return res;
}

export function parseCookies(req: BunRequest): Record<string, string> {
	const cookieHeader = req.headers.get("cookie") || "";
	return Object.fromEntries(
		cookieHeader
			.split(";")
			.map((entry) => {
				const [name, ...rest] = entry.trim().split("=");
				return [name, decodeURIComponent(rest.join("="))];
			})
			.filter(([name]) => !!name),
	);
}

// Session Management

const SESSION_SECRET = process.env.SESSION_SECRET;

export function createSession(userId: string): string {
	const sessionId = randomBytes(24).toString("hex");
	const signature = createHash("sha256")
		.update(`${sessionId}:${userId}:${SESSION_SECRET}`)
		.digest("hex");
	return `${sessionId}:${userId}:${signature}`;
}

export function verifySession(session: string): string | null {
	const [sessionId, userId, signature] = session.split(":");
	if (!sessionId || !userId || !signature) return null;

	const expected = createHash("sha256")
		.update(`${sessionId}:${userId}:${SESSION_SECRET}`)
		.digest("hex");

	const valid =
		signature.length === expected.length &&
		timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

	return valid ? userId : null;
}
