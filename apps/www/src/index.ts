import { server } from "brosel";

export default server({
	routes: {},
	hostname: "localhost",
	port: 3000,
	error: (err) => {
		return new Response("Error occured!" + err, { status: 500 });
	},
});
