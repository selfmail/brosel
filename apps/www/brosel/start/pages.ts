import { getConfig } from "../config/get-config";

/**
 * The creation of the pages in harder in the production server. We need to encrypt the
 * name of the script file, and we need to add important Headers to the Page.
 */
export async function compileProductionPages() {
	const config = await getConfig();
}
