import type * as neotest from 'neotest';
import { buildSpec } from 'neotest-playwright/build-spec';
import {
	discoverPositions,
	filterDir,
	isTestFile,
	root,
} from 'neotest-playwright/discover';
import { results } from 'neotest-playwright/results';

export const config = {
	name: 'neotest-playwright',
	is_test_file: isTestFile,
	root: root,
	filter_dir: filterDir,
	discover_positions: discoverPositions,
	build_spec: buildSpec,
	results: results,
} satisfies neotest.Adapter;
