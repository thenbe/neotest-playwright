declare function print(...args: unknown[]): void;

declare module 'neotest' {
	interface Position {
		id: string;
		type: 'dir' | 'file' | 'namespace' | 'test';
		name: string;
		path: string;
		/** [start_row, start_col, end_row, end_col] */
		range: [number, number, number, number];
	}

	interface RunArgs {
		extra_args?: string[];
		strategy: string;
		tree: Tree;
	}

	/** The context used by neotest-jest */
	interface Context {
		results_path: string;
		file: string;
		stop_stream: () => void;
	}

	interface RunSpec {
		command: string[];
		env?: Record<string, string>;
		cwd?: string;
		/* Arbitrary data to preserve state between running and result collection */
		context: Context;
		/** Arguments for strategy */
		strategy?: Record<string, unknown>;
		stream: (output_stream: () => string[]) => () => Record<string, Result>;
	}

	interface StrategyResult {
		code: number;
		output: string;
	}

	interface Result {
		status: 'passed' | 'failed' | 'skipped';
		/** Path to file containing full output data */
		output: string;
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
		// _data: unknown;
		// _children: Tree[];
		// _nodes: Record<string, Tree>;
		// _key: (data: unknown) => string;
		// _parent?: Tree;

		data(): Position;
		children(): Tree[];
		nodes(): Record<string, Tree>;
		key(): (data: unknown) => string;
		parent(): Tree | undefined;

		_get_key(key: unknown): Tree | null;
		_set_key(key: unknown, value: Tree): void;
		iter_parents(): IterableIterator<Tree>;

		/** Fetch the first node ascending the tree (including the current one)
		 * with the given data */
		closest_node_with(data_attr: string): Tree | null;

		// --- Parses a tree in the shape of nested lists.
		// --- The head of the list is the root of the tree, and all following elements are its children.
		// ---@param data any[]
		// ---@return neotest.Tree
		// function neotest.Tree.from_list(data, key)

		/** Parses a tree in the shape of nested lists.
		 * The head of the list is the root of the tree, and all following elements are its children. */
		static from_list(data: unknown[], key: (data: unknown) => string): Tree;

		// ---@param data any Node data
		// ---@param children neotest.Tree[] Children of this node
		// ---@param key fun(data: any): string
		// ---@param parent? neotest.Tree
		// ---@private
		// function neotest.Tree:new(data, children, key, parent, nodes)

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
	}
}
