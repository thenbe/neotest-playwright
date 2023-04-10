declare function print(...args: unknown[]): void;

type MatchType = 'namespace' | 'test';

type NodeMatch<T extends MatchType> = {
	[K in `${T}.name` | `${T}.definition`]: LuaUserdata;
};

type Range = LuaMultiReturn<[number, number, number, number]>;

declare module 'neotest' {
	interface RangelessPosition {
		id?: string;
		type: 'dir' | 'file' | 'namespace' | 'test';
		name: string;
		path: string;
		project_id?: string;
	}

	interface RangedPosition extends RangelessPosition {
		/** [start_row, start_col, end_row, end_col] */
		range: Range;
	}

	type Position = RangedPosition | RangelessPosition;

	type BuildPosition = (
		this: void,
		file_path: string,
		source: string,
		captured_nodes: NodeMatch<MatchType>,
	) => Position | Position[];

	type PositionId = (position: Position, parents: Position[]) => string;

	interface RunArgs {
		extra_args?: string[];
		strategy: string;
		tree: Tree;
	}

	/** The context used by neotest-jest */
	interface Context {
		results_path: string;
		file: string;
	}

	interface RunSpec {
		command: string[];
		env?: Record<string, string>;
		cwd?: string | null;
		/* Arbitrary data to preserve state between running and result collection */
		context: Context;
		/** Arguments for strategy */
		strategy?: Record<string, unknown>;
		stream?: (output_stream: () => string[]) => () => Record<string, Result>;
	}

	interface StrategyResult {
		code: number;
		output: string;
	}

	interface Result {
		status: 'passed' | 'failed' | 'skipped';
		/** Path to file containing full output data */
		output?: string;
		/** Shortened output string */
		short: string;
		errors: Error[];
	}

	interface Error {
		message: string;
		line?: number;
		// column?: number; // exists?
	}

	/** The key should be the treesitter id of the node.
	 * @example "path/to/file::Describe text::test text"
	 */
	type ResultKey = string;

	type Results = Record<ResultKey, Result>;

	/**
	 * @class neotest.Adapter
	 * @property {string} name
	 */
	/** @noSelf **/
	interface Adapter {
		name: string;

		/**
		 * See :h lspconfig-root-dir
		 *
		 * Find the project root directory given a current directory to work from.
		 * Should no root be found, the adapter can still be used in a non-project context if a test file matches.
		 *
		 * @async
		 * @param {string} dir - Directory to treat as cwd
		 * @returns {string | undefined} - Absolute root dir of test suite
		 */
		root(dir: string): string | undefined;

		/**
		 * Filter directories when searching for test files
		 *
		 * @async
		 * @param {string} name - Name of directory
		 * @param {string} rel_path - Path to directory, relative to root
		 * @param {string} root - Root directory of project
		 * @returns {boolean}
		 */
		filter_dir(name: string, rel_path: string, root: string): boolean;

		/**
		 * @async
		 * @param {string} file_path
		 * @returns {boolean}
		 */
		is_test_file(file_path: string): boolean;

		/**
		 * Given a file path, parse all the tests within it.
		 *
		 * @async
		 * @param {string} file_path - Absolute file path
		 * @returns {Tree | undefined}
		 */
		discover_positions(path: string): Tree | undefined;

		/**
		 * @param {RunArgs} args
		 * @returns {RunSpec | RunSpec[] | undefined}
		 */
		build_spec(args: RunArgs): RunSpec | RunSpec[] | undefined;

		/**
		 * @async
		 * @param {RunSpec} spec
		 * @param {StrategyResult} result
		 * @param {Tree} tree
		 * @returns {Record<string, Result>}
		 */
		results(
			spec: RunSpec,
			result: StrategyResult,
			tree: Tree,
		): Record<string, Result>;
	}

	/* Nested tree structure with nodes containing data and having any number of
	 * children */
	class Tree {
		/** Create a new tree node */
		constructor(
			/** Node data */
			data: Position,

			/** Children of this node */
			children: Tree[],

			/** Function to generate a key from the node data */
			key: (data: unknown) => string,

			/** Parent of this node */
			parent?: Tree,

			/** Nodes of this tree */
			nodes?: Record<string, Tree>,
		);

		/** Parses a tree in the shape of nested lists.
		 * The head of the list is the root of the tree, and all following elements are its children. */
		static from_list(data: unknown[], key: (data: unknown) => string): Tree;

		data(): Position;
		children(): Tree[];
		nodes(): Record<string, Tree>;
		key(): (data: unknown) => string;
		parent(): Tree | undefined;

		get_key(key: unknown): Tree | null;
		set_key(key: unknown, value: Tree): void;
		iter_parents(): IterableIterator<Tree>;

		/** Fetch the first node ascending the tree (including the current one)
		 * with the given data */
		closest_node_with(data_attr: string): Tree | null;

		/** Fetch the first non-nil value for the given data attribute ascending the
tree (including the current node) with the given data attribute. */
		closest_value_for(data_attr: string): unknown | null;
	}
}

declare module 'neotest.async' {
	namespace fn {
		/** The result is a String, which is the name of a file that doesn't exist.
		 * It can be used for a temporary file.
		 *
		 * Proxy for `vim.fn.tempname()`
		 */
		const tempname: () => string;
	}

	const run: (this: void, callback: () => void) => void;
}

declare module 'neotest.lib' {
	namespace treesitter {
		/** Read a file's contents from disk and parse test positions using the
		 * given query. Executed in a subprocess to avoid blocking the editor if
		 * possible. Since functions can't be serialised for RPC the build_position and
		 * position_id options can be strings that will evaluate to globally
		 * referencable functions (e.g. `'require("my_adapter")._build_position'`). */
		const parse_positions: (
			this: void,
			path: string,
			query: string,
			opts: ParseOptions,
		) => import('neotest').Tree;

		interface ParseOptions {
			/** Allow nested tests */
			nested_tests?: boolean;
			/** Require tests to be within namespaces */
			require_namespaces?: boolean;
			/** Position ID constructor */

			/** Return a string that will evaluate to a globally referencable function.
			 * e.g. `'require("my_adapter")._position_id'` */
			position_id?: PositionId | string;

			/** Return a string that will evaluate to a globally referencable function.
			 * e.g. `'require("my_adapter")._build_position'`
			 *
			 * https://github.com/nvim-neotest/neotest/issues/68#issuecomment-1242769159 */
			build_position?: BuildPosition | string;
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

	namespace subprocess {
		/** Wrapper around vim.fn.rpcrequest that will automatically select the channel for the child or parent process,
		 * depending on if the current instance is the child or parent.
		 * See `:help rpcrequest` for more information. */
		const request: (
			method: string,
			...args: unknown[]
		) => LuaMultiReturn<[unknown, string?]>;

		/** Wrapper around vim.fn.rpcnotify that will automatically select the channel for the child or parent process,
		 * depending on if the current instance is the child or parent.
		 * See `:help rpcnotify` for more information. */
		const notify: (method: string, ...args: unknown[]) => void;

		/** Call a lua function in the other process with the given argument list, returning the result. */
		const call: (
			func: string,
			args?: unknown[],
		) => LuaMultiReturn<[unknown, string?]>;

		/** Check if the subprocess has been initialized and is working */
		const enabled: () => boolean;

		/** Check if the current neovim instance is the child or parent process */
		const is_child: () => boolean;
	}
}

declare module 'neotest.logging' {
	const trace: (message: string, cause?: unknown) => void;
	const debug: (message: string, cause?: unknown) => void;
	const info: (message: string, cause?: unknown) => void;
	const warn: (message: string, cause?: unknown) => void;
	const error: (message: string, cause?: unknown) => void;
}
