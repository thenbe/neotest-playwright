import type * as neotest from 'neotest';
import { buildSpec } from 'neotest-playwright/build-spec';
import { parseOutput } from 'neotest-playwright/report';
import * as lib from 'neotest.lib';

const isTestFile = (file_path: string | undefined): boolean => {
	if (!file_path) {
		return false;
	}

	// TODO: Don't hardcode. Either get from user config or resolve using playwright cli.
	const endings = ['.spec.ts', '.test.ts', '.spec.js', '.test.js'];

	const result = endings.some((ending) => file_path.endsWith(ending));

	return result;
};

const discoverPositions = (path: string) => {
	const query = `
		; -- Namespaces --

		; Matches: test.describe('title')

		(call_expression
		 function: (member_expression) @func_name (#eq? @func_name "test.describe")

		 arguments: (arguments
			 (string (string_fragment) @namespace.name)
			 ) @namespace.definition
		 )

		; -- Tests --

		; Matches: test('title')

		(call_expression
		 function: (identifier) @func_name (#eq? @func_name "test")

		 arguments: (arguments
			(string (string_fragment) @test.name
			)
			) @test.definition
		)

		; Matches: test.only('title') / test.fixme('title')

		(call_expression
		 function: (member_expression) @func_name (#any-of? @func_name "test.only" "test.fixme" "test.skip")

		 arguments: (arguments
			(string (string_fragment) @test.name)
			) @test.definition
		)
		`;

	return lib.treesitter.parse_positions(path, query, { nested_tests: true });
};

export const adapter = {
	name: 'neotest-playwright',

	is_test_file: isTestFile,

	// We'll use the root to locate the playwright binary
	// root: lib.files.match_root_pattern('playwright.config.ts'),
	root: lib.files.match_root_pattern('package.json'),

	discover_positions: discoverPositions,

	filter_dir(name, _rel_path, _root) {
		return name !== 'node_modules';
	},

	build_spec(args) {
		// print(vim.inspect(args));
		return buildSpec(args);
	},

	results(spec, _result, _tree) {
		spec.context?.stop_stream();

		const resultsPath = spec.context?.results_path;

		const [success, data] = pcall(lib.files.read, resultsPath);

		if (!success) {
			print('No test output file found', resultsPath);
			return {};
		}

		const [ok, parsed] = pcall(vim.json.decode, data, {
			luanil: { object: true },
		});

		if (!ok) {
			print('Failed to parse test output json', resultsPath);
			return {};
		}

		const results = parseOutput(parsed, resultsPath);

		return results;
	},
} satisfies neotest.Adapter;
