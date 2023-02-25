import type { Adapter } from './types/adapter';

// Options is in it's own file to avoid circular dependencies.
export const data: Adapter['data'] = {
	report: null,
	specs: null,
	rootDir: null,
};
