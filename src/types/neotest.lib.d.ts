declare module 'neotest.lib' {
	namespace treesitter {
		const parse_positions: (
			path: string,
			query: string,
			options: ParseOptions,
		) => import('neotest').Tree;

		interface ParseOptions {
			/** Allow nested tests */
			nested_tests?: boolean;
			/** Require tests to be within namespaces */
			require_namespaces?: boolean;
			/** Position ID constructor */
			position_id?: (
				position: import('neotest').Position,
				parents: import('neotest').Position[],
			) => string;
		}
	}

	namespace files {
		/**
		 * Create a function that will take directory and attempt to match the
		 * provided glob patterns against the contents of the directory.
		 *
		 * @param ... string Patterns to match e.g "*.py"
		 * @return fun(path: string): string | nil
		 */
		const match_root_pattern: (
			...patterns: string[]
		) => (path: string) => string | undefined;

		const exists: (path: string) => boolean | string;

		/** Read a file asynchronously */
		const read: (file_path: string) => string | string;

		const write: (file_path: string, data: string) => boolean | string;

		/** Streams data from a file, watching for new data over time. Only works
		 * when data is exclusively added and not deleted from the file. Useful for
		 * watching a file which is written to by another process.
		 *
		 * Source: https://github.com/nvim-neotest/neotest/blob/master/lua/neotest/lib/file/init.lua#L93-L144
		 */
		const stream: (
			file_path: string,
		) => LuaMultiReturn<[() => string, () => void]>;
	}
}
