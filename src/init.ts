import type * as neotest from 'neotest';
import { buildSpec } from 'neotest-playwright/build-spec';
import {
	discoverPositions,
	filterDir,
	isTestFile,
	root,
} from 'neotest-playwright/discover';
import { results } from 'neotest-playwright/results';

export const adapter = {
	name: 'neotest-playwright',
	is_test_file: isTestFile,
	root: root,
	filter_dir: filterDir,
	discover_positions: discoverPositions,
	build_spec: buildSpec,
	results: results,
} satisfies neotest.Adapter;

setmetatable(adapter, {
	__call(config) {
		// TODO: use better log technique
		if (config.debug) {
			print('neotest-playwright config:');
			print(vim.inspect(config, {}));
		}
		// TODO: apply env, cwd, getPlaywrightConfig, getPlaywrightBin from config
		return adapter;
	},
});
