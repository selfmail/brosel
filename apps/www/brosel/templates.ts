/*
Code templates for the loading functions.
*/

/**
 * This is the typescript code template to hydrate the client's page. We pass the props to the hydration, in order to
 * save the props from the server. This code will be transformed with bun to a javascript file, stored in the `.brosel` folder.
 */
export const hydrationTemplate = (file: string) => `/// <reference lib="dom" />
import Component from "${file}";
import { hydrateRoot } from "react-dom/client";

const props = (
	window as Window &
		typeof globalThis & { __INITIAL_PROPS__: Record<string, unknown> }
).__INITIAL_PROPS__;


hydrateRoot(document, <Component {...props} />);
`;
