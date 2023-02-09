import { config } from './config';
import { create_preset_command } from './preset';

// Initialize the adapter
create_preset_command();

export const adapter = config;

setmetatable(adapter, {
	__call(arg) {
		// TODO: use better log technique
		// if (config.debug) {
		print('neotest-playwright config:');
		print(vim.inspect(arg, {}));
		// }
		// TODO: apply env, cwd, getPlaywrightConfig, getPlaywrightBin from config

		// const updated = createAdapter(config);

		return adapter;
	},
});
