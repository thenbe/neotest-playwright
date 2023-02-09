import * as lib from 'neotest.lib';
import type { Adapter } from './types/adapter';

export const root = lib.files.match_root_pattern('package.json');

export const filterDir = ((name: string, _rel_path: string, _root: string) => {
	return name !== 'node_modules';
}) satisfies Adapter['filter_dir'];

export const isTestFile = ((file_path: string | undefined): boolean => {
	if (!file_path) {
		return false;
	}

	// TODO: Don't hardcode. Either get from user config or resolve using playwright cli.
	const endings = ['.spec.ts', '.test.ts', '.spec.js', '.test.js'];

	const result = endings.some((ending) => file_path.endsWith(ending));

	return result;
}) satisfies Adapter['is_test_file'];

export const discoverPositions = ((path: string) => {
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
}) satisfies Adapter['discover_positions'];
