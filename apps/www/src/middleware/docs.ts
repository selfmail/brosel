import { middleware } from "../../brosel/middleware";

export default middleware(async (req, res) => {
	console.log("Path middleware !!!");

	return res.next();
}, "/docs");
