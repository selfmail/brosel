import { server } from "brosel";

export default server({
	routes: {},
	hostname: "localhost",
	port: 3000,
	error: (err) => {
		throw new Error(err.message);
	},
});
