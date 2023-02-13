import * as logger from 'neotest.logging';
import type { Adapter } from './types/adapter';

type ProjectCache = Pick<Adapter['options'], 'projects'>;

type Cache = Record<string, ProjectCache>;

const current = vim.fn.getcwd();

const dataPath = vim.fn.stdpath('data');
const dataFile = `${dataPath}/neotest-playwright.json`;

export const loadCache = (): Cache | null => {
	logger.trace('neotest-playwright loadCache(): Loading cache from', dataFile);

	const existing = vim.fn.readfile(dataFile);

	if (existing.length === 0) {
		return null;
	}

	const cache: Cache = vim.fn.json_decode(existing[0]);

	return cache;
};

/** Persists the selected projects to disk. Project selection is scoped
 * to project directory. */
export const saveCache = (cache: Cache) => {
	logger.trace('neotest-playwright saveCache(): Saving data to', dataFile);

	vim.fn.writefile([vim.fn.json_encode(cache)], dataFile);
};

export const loadProjectCache = (): ProjectCache | null => {
	const cache = loadCache();

	if (cache === null) {
		return null;
	}

	const projectCache = cache[current] ?? null;

	logger.trace('neotest-playwright loadProjectCache():', projectCache);

	return projectCache;
};

export const saveProjectCache = (latest: ProjectCache) => {
	logger.trace('neotest-playwright saveProjectCache():', latest);

	const cache = loadCache() ?? {};

	cache[current] = latest;

	saveCache(cache);
};
