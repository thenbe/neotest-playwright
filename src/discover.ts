import type { BuildPosition, PositionId } from 'neotest';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import { data } from './adapter-data';
import { options } from './adapter-options';
import { getTests } from './playwright';
import { buildTestPosition } from './position';
import { flattenSpecs } from './report';
import { readReport } from './report-io';
import type { Adapter, AdapterData } from './types/adapter';

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

	return lib.treesitter.parse_positions(path, query, {
		nested_tests: true,
		position_id: 'require("neotest-playwright.discover")._position_id',
		...(options.enable_dynamic_test_discovery
			? {
					build_position:
						'require("neotest-playwright.discover")._build_position',
			  }
			: {}),
	});
}) satisfies Adapter['discover_positions'];

const getMatchType = <T extends MatchType>(node: NodeMatch<T>) => {
	if ('test.name' in node) {
		return 'test';
	} else if ('namespace.name' in node) {
		return 'namespace';
	} else {
		throw new Error('Unknown match type');
	}
};

export const _build_position: BuildPosition = (
	filePath,
	source,
	capturedNodes,
) => {
	const match_type = getMatchType(capturedNodes);

	const name = vim.treesitter.get_node_text(
		capturedNodes[`${match_type}.name`],
		source,
	) as string;

	const definition = capturedNodes[`${match_type}.definition`];
	const range = [definition.range()] as unknown as Range;

	if (match_type === 'namespace') {
		return {
			type: match_type,
			range,
			path: filePath,
			name,
		};
	} else if (match_type === 'test') {
		const base = {
			type: match_type,
			range,
			path: filePath,
			name,
		} as const;

		const position = buildTestPosition(base);

		return position;
	} else {
		throw new Error('Unknown match type');
	}
};

export const _position_id: PositionId = (position, _parent) => {
	return position.id ?? position.path + position.name;
};

// TODO: remove debug logging
// FIX: this stalls sometimes
export const _get_data = () => {
	logger.debug('======getting data=======');
	if (data.specs && data.rootDir) {
		logger.debug('data already exists');
	} else {
		logger.debug('======data does not exist. refreshing...=======');

		const report = getTests() as NonNullable<AdapterData['report']>;
		logger.debug('report', report);

		data.report = report; // TODO: do we need to store this?
		data.specs = flattenSpecs(report.suites);
		data.rootDir = report.config.rootDir;
	}

	return {
		report: data.report!,
		specs: data.specs!,
		rootDir: data.rootDir!,
	};
};
