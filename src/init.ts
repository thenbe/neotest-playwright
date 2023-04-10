import { options } from './adapter-options';
import { create_refresh_command } from './commands';
import { config } from './config';
import { logger } from './logging';
import { create_preset_command } from './preset';
import { create_project_command, loadPreselectedProjects } from './project';

// Initialize the adapter
create_preset_command();
create_project_command();
create_refresh_command();

export const adapter = config;

setmetatable(adapter, {
	__call(arg: unknown) {
		logger('debug', 'config', arg);

		let userOptions = {};
		// @ts-expect-error wip
		if (arg && type(arg) === 'table' && 'options' in arg) {
			userOptions = arg.options ?? {};
		}

		const updated = {
			...config.options,
			...userOptions,
		};

		// Apply user config
		for (const [key, value] of pairs(updated)) {
			// @ts-expect-error wip
			config.options[key] = value;
		}

		if (options.persist_project_selection) {
			const projects = loadPreselectedProjects();
			if (projects) {
				options.projects = projects;
			}
		}

		logger('debug', 'options', options);

		return adapter;
	},
});
