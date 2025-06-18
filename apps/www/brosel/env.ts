import { getConfig } from "./config/get-config";

export async function checkEnv() {
	const config = await getConfig();
}
