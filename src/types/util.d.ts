declare module 'neotest-playwright.util' {
	/** Find the closest ancestor containing a file or directory with the given name.
	 * @param startpath The path to start searching from.
	 * @param name The name of the file or directory to search for.
	 * @param is_dir Whether to search for a directory or a file.
	 * @returns The path to the file or directory, or null if not found.
	 */
	const find_ancestor: (
		startpath: string,
		name: string,
		is_dir: boolean,
	) => string | null;
}
