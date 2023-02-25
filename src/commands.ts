import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { emitError } from './helpers';
import { getTests } from './playwright';
import { writeReport } from './report-io';

// WARN: remove debug code

// TODO: remove
export const create_refresh_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightRefresh',
		// @ts-expect-error until type is updated
		() => {
			logger.debug('NeotestPlaywrightRefresh');
			const output = getTests();

			logger.debug(
				'NeotestPlaywrightRefresh saving output',
				options.tempDataFile,
			);

			if (output !== null) {
				writeReport(options.tempDataFile, output);
			} else {
				emitError('Failed to get output');
			}
		},
		{
			nargs: 0,
		},
	);
};
