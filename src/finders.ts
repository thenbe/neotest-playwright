import * as lib from 'neotest.lib';
import { logger } from './logging';
import type { AdapterOptions } from './types/adapter';

export const getPlaywrightBinary: AdapterOptions['get_playwright_binary'] = (
	path,
) => {
	const dir = get_cwd(path);

	const node_modules = `${dir}/node_modules`;

	const bin = `${node_modules}/.bin/playwright`;

	if (lib.files.exists(bin)) {
		return bin;
	} else {
		logger('error', 'playwright binary does not exist at ', bin);
		throw new Error(
			'Unable to locate playwright binary. Expected to find it at: ' + bin,
		);
	}
};

export const getPlaywrightConfig: AdapterOptions['get_playwright_config'] = (
	path,
) => {
	const dir = get_cwd(path);

	const configs = [
		`${dir}/playwright.config.ts`,
		`${dir}/playwright.config.js`,
		`${dir}/playwright.config.mjs`,
		`${dir}/playwright.config.mts`,
		`${dir}/playwright.config.cjs`,
		`${dir}/playwright.config.cts`,
	];

	for (const config of configs) {
		if (lib.files.exists(config)) {
			return config;
		}
	}

	logger('error', 'Unable to locate playwright config file.');
	throw new Error(
		'Unable to locate playwright config file. Expected to find it at: ' +
			configs.join(', '),
	);
};

export const get_cwd: NonNullable<AdapterOptions['get_cwd']> = (path) => {
	const dir = path
		? lib.files.match_root_pattern(
				'playwright.config.ts',
				'playwright.config.js',
				'playwright.config.mjs',
				'playwright.config.mts',
				'playwright.config.cjs',
				'playwright.config.cts',
		  )(path)
		: null;

	return dir ?? (vim.loop.cwd() as unknown as string);
};
