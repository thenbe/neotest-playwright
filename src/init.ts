import * as logger from 'neotest.logging';
import { config } from './config';
import { create_preset_command } from './preset';

// Initialize the adapter
create_preset_command();

export const adapter = config;

setmetatable(adapter, {
	__call(arg) {
		logger.debug('neotest-playwright adapter', arg);

		// TODO: apply env, cwd, getPlaywrightConfig, getPlaywrightBin from config

		return adapter;
	},
});
