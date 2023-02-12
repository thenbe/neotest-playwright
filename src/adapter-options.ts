import { getPlaywrightBinary, getPlaywrightConfig } from './finders';
import type { Adapter } from './types/adapter';

// Options is in it's own file to avoid circular dependencies.
export const options: Adapter['options'] = {
	projects: [],
	preset: 'none',
	persist_project_selection: false,
	get_playwright_command: getPlaywrightBinary,
	get_playwright_config: getPlaywrightConfig,
	get_cwd: null,
	env: {},
	extra_args: [],
	tempDataFile: vim.fn.stdpath('data') + '/neotest-playwright-test-list.json',
};
