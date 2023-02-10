import { getPlaywrightBinary, getPlaywrightConfig } from './finders';
import type { Adapter } from './types/adapter';

// Options is in it's own file to avoid circular dependencies.
export const options: Adapter['options'] = {
	projects: [],
	preset: 'none',
	persist_project_selection: false,
	get_playwright_command: getPlaywrightBinary,
	get_playwright_config: getPlaywrightConfig,
};
