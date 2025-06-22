// Custom error class for Brösel

export class BroeselError extends Error {
	public code?: string;
	public details?: unknown;

	constructor({
		publicMessage = "An error occurred in Brösel",
		code,
		details,
	}: {
		publicMessage: string;
		code: number;
		details?: string;
	}) {
		super(publicMessage);
		this.name = "BroeselError";
		this.code = code.toString();
		this.details = details;
	}
}

/**
 * A global errror handler for Brösel. You don't need to import this function, it is automatically available in the global scope.
 *
 * @param params - The parameters for the error. For example:
 * - `publicMessage`: A message that will be shown to the user.
 * - `code`: A numeric code for the error.
 * - `details`: Additional details about the error, which will not be shown to the user
 *
 * Example:
 *
 * ```ts
 * // your code...
 * throwError({
 *   publicMessage: "Something went wrong",
 *   code: 500,
 *   details: "This is a detailed error message that won't be shown to the user.",
 * });
 * ```
 *
 */
export function throwError(params: {
	publicMessage: string;
	code: number;
	details?: string;
}): never {
	throw new BroeselError(params);
}
