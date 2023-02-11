import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { config } from './config';
import { create_preset_command } from './preset';
import { create_project_command, loadPreselectedProjects } from './project';

// Initialize the adapter
create_preset_command();
create_project_command();

export const adapter = config;

setmetatable(adapter, {
	__call(arg) {
		logger.debug('neotest-playwright arg', arg);

		const updated = {
			...config.options,
			...arg.options,
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

		logger.debug('neotest-playwright options', options);

		return adapter;
	},
});
