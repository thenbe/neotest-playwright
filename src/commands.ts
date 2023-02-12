import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { getTests } from './playwright';
import { writeReport } from './report-io';

// WARN: remove debug code
// WARN: remove debug logs

export const create_refresh_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightRefresh',
		// @ts-expect-error until type is updated
		() => {
			logger.debug('NeotestPlaywrightRefresh');
			const output = getTests();

			logger.debug(
				'NeotestPlaywrightRefresh saving output +++++++++++++++++++',
				options.tempDataFile,
			);

			if (output !== null) {
				writeReport(options.tempDataFile, output);
			} else {
				logger.error('NeotestPlaywrightRefresh failed to get output');
				// TODO: replace vim.notify
				vim.notify('Failed to get output', vim.log.levels.ERROR, {});
			}
		},
		{
			nargs: 0,
		},
	);
};
