import type { Adapter } from 'neotest';
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
			if (key === 'filter_dir') {
				const filter_dir = value as Adapter["filter_dir"]
				// @ts-expect-error filter_dir optionally defined by users should
				// override the adapter's own filter_dir
				config.filter_dir = filter_dir;
				continue;
			}

			if (key === 'is_test_file') {
				const is_test_file = value as Adapter["is_test_file"]
				// @ts-expect-error is_test_file optionally defined by users should
				// override the adapter's own is_test_file
				config.is_test_file = is_test_file;
				continue;
			}

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
