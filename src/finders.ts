import * as util from 'neotest-playwright.util';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import type { AdapterOptions } from './types/adapter';

export const getPlaywrightBinary: AdapterOptions['get_playwright_command'] = (
	filePath: string,
) => {
	const node_modules =
		util.find_ancestor(filePath, 'node_modules', true) + '/node_modules';

	const bin = `${node_modules}/.bin/playwright`;

	if (lib.files.exists(bin)) {
		return bin;
	} else {
		logger.error('playwright binary does not exist at ', bin);
		throw new Error(
			'Unable to locate playwright binary. Expected to find it at: ' +
				bin +
				' - To use a custom binary path, set the `get_playwright_command` option. See the docs for more info.',
		);
	}
};

export const getPlaywrightConfig = (filePath: string) => {
	const configDir = util.find_ancestor(filePath, 'playwright.config.ts', false);
	const config = `${configDir}/playwright.config.ts`; // TODO: don't hardcode

	if (lib.files.exists(config)) {
		return config;
	}

	logger.info('Unable to locate playwright config file.');

	return null;
};
