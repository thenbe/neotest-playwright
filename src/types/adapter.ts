import type * as neotest from 'neotest';

interface AdapterOptions {
	projects: string[];
}

export interface Adapter extends neotest.Adapter {
	options: AdapterOptions;
}
