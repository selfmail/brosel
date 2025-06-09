/// <reference lib="dom" />
import Component from "/Users/henrigenerlich/Documents/code/brosel/apps/www/src/pages/docs/index.client.tsx";
import { hydrateRoot } from "react-dom/client";

const props = (
	window as Window &
		typeof globalThis & { __INITIAL_PROPS__: Record<string, unknown> }
).__INITIAL_PROPS__;


hydrateRoot(document, <Component {...props} />);
