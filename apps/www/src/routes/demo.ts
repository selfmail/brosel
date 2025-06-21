import { route } from "brosel";

export default route(
	{
		POST: async (req) => {
			return new Response("Hello World");
		},
	},
	"/api/demo",
);
