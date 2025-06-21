import { route } from "brosel";
import { hashPassword } from "brosel/auth";

// In-memory mock store
const users = new Map<string, { id: string; password: string }>();

export default route(
	{
		POST: async (req) => {
			const { email, password } = await req.json();

			if (typeof email !== "string" || typeof password !== "string") {
				return new Response("Invalid input", { status: 400 });
			}

			if (users.has(email)) {
				return new Response("User already exists", { status: 409 });
			}

			const hashed = await hashPassword(password);
			const userId = crypto.randomUUID();
			users.set(email, { id: userId, password: hashed });

			return new Response("User registered", { status: 201 });
		},
	},
	"/api/auth/register",
);
