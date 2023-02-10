import type * as neotest from 'neotest';
import type { Preset } from 'neotest-playwright/preset-options';

export interface AdapterOptions {
	preset: Preset;
	projects: string[];
	persist_project_selection: boolean;
	/** Given a test file path, return the path to the playwright binary. */
	get_playwright_command: (this: void, file_path: string) => string;
	/** Given a test file path, return the path to the playwright config file. */
	get_playwright_config: (this: void, file_path: string) => string | null;
	/** Environment variables to pass to the playwright command. */
	env: Record<string, string>;
	get_cwd: null | ((this: void, file_path: string) => string);
}

export interface Adapter extends neotest.Adapter {
	options: AdapterOptions;
}
