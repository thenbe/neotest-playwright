import { createAdapter } from './adapter';
import { create_preset_command } from './preset';

// Initialize the adapter
create_preset_command();

export const adapter = createAdapter();

setmetatable(adapter, {
	__call(config) {
		// TODO: use better log technique
		if (config.debug) {
			print('neotest-playwright config:');
			print(vim.inspect(config, {}));
		}
		// TODO: apply env, cwd, getPlaywrightConfig, getPlaywrightBin from config

		const updated = createAdapter(config);

		return updated;
	},
});
