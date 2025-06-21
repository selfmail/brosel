import { rootMiddleware } from "../../brosel/middleware";

export default rootMiddleware(async (req, res) => {
	// Example middleware logic
	if (req.method !== "GET") {
		return res.deny("Method not allowed");
	}

	// You can add more logic here, like authentication, logging, etc.

	// If everything is fine, continue to the next middleware or route handler
	return res.next();
});
