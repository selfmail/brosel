import consola from "consola";
import { middleware } from "../../brosel/middleware";

export default middleware(async (req, res) => {
	consola.log("Running the path middleware for /docs!");

	return res.next();
}, "/docs");
