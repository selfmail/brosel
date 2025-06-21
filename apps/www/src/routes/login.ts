import { route } from "brosel";
import { createSession, setCookie, verifyPassword } from "brosel/auth";

// Reuse the same in-memory store
const users = new Map<string, { id: string; password: string }>();

export default route(
	{
		POST: async (req) => {
			const { email, password } = await req.json();

			if (typeof email !== "string" || typeof password !== "string") {
				return new Response("Invalid input", { status: 400 });
			}

			const user = users.get(email);
			if (!user) {
				return new Response("Invalid credentials", { status: 401 });
			}

			const valid = await verifyPassword(password, user.password);
			if (!valid) {
				return new Response("Invalid credentials", { status: 401 });
			}

			const session = createSession(user.id);
			const res = new Response("Logged in", { status: 200 });

			setCookie(res, "session", session, {
				httpOnly: true,
				secure: true,
				sameSite: "Strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return res;
		},
	},
	"/api/auth/login",
);
