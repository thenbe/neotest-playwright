import * as async from 'neotest.async';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import { refresh_data } from './discover';

// WARN: remove debug code

const refresh_command = () => {
	if (lib.subprocess.enabled()) {
		logger.info('refreshing data in subprocess');
		// This is async and will wait for the function to return
		lib.subprocess.call("require('neotest-playwright.discover').refresh_data");
	} else {
		refresh_data();
	}
};

export const create_refresh_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightRefresh',
		// @ts-expect-error until type is updated
		() => {
			// Wrap with async.run to avoid error: https://github.com/nvim-neotest/neotest/issues/167
			async.run(refresh_command);
		},
		{
			nargs: 0,
		},
	);
};
