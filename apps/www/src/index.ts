import { server } from "../brosel/server-options";

export default server({
	routes: {},
	hostname: "localhost",
	port: 3000,
	error: (err) => {
		throw new Error(err.message);
	},
});
