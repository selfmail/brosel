import { server } from "../brosel/server-options";

export default server({
	routes: {
		"/welcome": (req) => {
			return new Response("Welcome to brösel!");
		},
	},
	hostname: "localhost",
	port: 3000,
	error: (err) => {
		throw new Error(err.message);
	},
});
