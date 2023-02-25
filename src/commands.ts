import * as logger from 'neotest.logging';
import { refresh_data } from './discover';

// WARN: remove debug code

export const create_refresh_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightRefresh',
		// @ts-expect-error until type is updated
		() => {
			logger.debug('NeotestPlaywrightRefresh');
			refresh_data();
		},
		{
			nargs: 0,
		},
	);
};
