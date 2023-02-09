import type * as neotest from 'neotest';
import type { Preset } from 'neotest-playwright/preset-options';

interface AdapterOptions {
	preset: Preset;
	projects: string[];
}

export interface Adapter extends neotest.Adapter {
	options: AdapterOptions;
}
