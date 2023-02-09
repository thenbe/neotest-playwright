import type * as neotest from 'neotest';
import { buildSpec } from 'neotest-playwright/build-spec';
import {
	discoverPositions,
	filterDir,
	isTestFile,
	root,
} from 'neotest-playwright/discover';
import { results } from 'neotest-playwright/results';

const DEFAULT_ADAPTER = {
	name: 'neotest-playwright',
	is_test_file: isTestFile,
	root: root,
	filter_dir: filterDir,
	discover_positions: discoverPositions,
	build_spec: buildSpec,
	results: results,
} satisfies neotest.Adapter;

/** Factory function for creating an adapter. */
export const createAdapter = (
	config?: Partial<neotest.Adapter>,
): neotest.Adapter => {
	const adapter = { ...DEFAULT_ADAPTER, ...config };

	return adapter;
};
