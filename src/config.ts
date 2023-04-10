import { buildSpec } from 'neotest-playwright/build-spec';
import {
	discoverPositions,
	filterDir,
	isTestFile,
	root,
} from 'neotest-playwright/discover';
import { results } from 'neotest-playwright/results';
import { data } from './adapter-data';
import { options } from './adapter-options';
import type { Adapter } from './types/adapter';

export const config: Readonly<Adapter> = {
	name: 'neotest-playwright',
	is_test_file: isTestFile,
	root: root,
	filter_dir: options.filter_dir ?? filterDir,
	discover_positions: discoverPositions,
	build_spec: buildSpec,
	results: results,
	options: options,
	data: data,
};
