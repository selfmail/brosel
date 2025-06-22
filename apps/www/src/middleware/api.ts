import { middleware } from "../../brosel/middleware";

export default middleware(async (req, res) => {
	console.log("API middleware triggered for path:", req.url);
	return res.next();
}, "/api/:apiPath");
