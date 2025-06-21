import { rootMiddleware } from "../../brosel/middleware";

export default rootMiddleware(async (req, res) => {
	console.log(`Request received: ${req.method} ${req.url}`);

	// You can add more logic here, like authentication, logging, etc.

	// If everything is fine, continue to the next middleware or route handler
	return res.next();
});
