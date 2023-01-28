declare module 'neotest.async' {
	namespace fn {
		/** The result is a String, which is the name of a file that doesn't exist.
		 * It can be used for a temporary file.
		 *
		 * Proxy for `vim.fn.tempname()`
		 */
		const tempname: () => string;
	}
}
