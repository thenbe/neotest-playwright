import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import type { AdapterOptions } from './types/adapter';

export const getPlaywrightBinary: AdapterOptions['get_playwright_command'] =
	() => {
		const dir = get_cwd();

		const node_modules = `${dir}/node_modules`;

		const bin = `${node_modules}/.bin/playwright`;

		if (lib.files.exists(bin)) {
			return bin;
		} else {
			logger.error('playwright binary does not exist at ', bin);
			throw new Error(
				'Unable to locate playwright binary. Expected to find it at: ' +
					bin +
					' - If you are in a monorepo, try running this command from a buffer in the subrepo that contains the playwright binary. Otherwise, to use a custom binary path, set the `get_playwright_command` option. See the docs for more info.',
			);
		}
	};

export const getPlaywrightConfig: AdapterOptions['get_playwright_config'] =
	() => {
		const dir = get_cwd();

		const config = `${dir}/playwright.config.ts`;

		if (lib.files.exists(config)) {
			return config;
		} else {
			logger.info('Unable to locate playwright config file.');

			throw new Error(
				'Unable to locate playwright config file. Expected to find it at: ' +
					config,
			);
		}
	};

export const get_cwd: NonNullable<AdapterOptions['get_cwd']> = () => {
	// current buffer's path (for non-file buffers, return buffer name. E.g. "Neotest Summary")
	// const dir = vim.api.nvim_eval('expand("%:p:h")') as unknown as string;

	const dir = vim.loop.cwd() as unknown as string;

	return dir;
};
