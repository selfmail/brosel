import { route } from "brosel";

export default route(
	{
		GET: async (req) => {
			return new Response("Hello World");
		},
	},
	"/api/demo",
);
