import type { Adapter } from './types/adapter';

// Options is in it's own file to avoid circular dependencies.
export const options: Adapter['options'] = {
	projects: [],
	preset: 'none',
};
