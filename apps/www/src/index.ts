import { server } from "brosel";

export default server({
	routes: {},
	hostname: "localhost",
	port: 3000,
	error: (err) => {
		// return a html file, redirect, text or json response
		console.error("An error occurred:", err);
		if (err instanceof Error) {
			return new Response(err.message, { status: 500 });
		}
		return new Response("Error occured!", { status: 500 });
	},
});
