import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';
import type { Preset } from 'neotest-playwright/preset-options';

export interface AdapterOptions {
	preset: Preset;
	projects: string[];
	persist_project_selection: boolean;
	/** Given a test file path, return the path to the playwright binary. */
	get_playwright_binary: (this: void) => string;
	/** Given a test file path, return the path to the playwright config file. */
	get_playwright_config: (this: void) => string | null;
	/** Environment variables to pass to the playwright command. */
	env: Record<string, string>;
	get_cwd: null | ((this: void) => string);
	/** Extra arguments to pass to the playwright command. These are merged with
	 * any extra_args passed to the neotest run command. */
	extra_args: string[];
	tempDataFile: string;
	/** If true, the adapter will attempt to use the playwright cli to
	 * enhance the test discovery process. */
	enable_dynamic_test_discovery: boolean;
	/** Override the default filter_dir function. */
	filter_dir?: Adapter['filter_dir'];
}

export type AdapterData =
	| {
			projects: string[];
			report: P.JSONReport;
			specs: P.JSONReportSpec[];
			rootDir: string;
	  }
	| {
			projects: null;
			report: null;
			specs: null;
			rootDir: null;
	  };

export interface Adapter extends neotest.Adapter {
	options: AdapterOptions;
	data: AdapterData;
}
