import type * as P from '@playwright/test/reporter';
import { show_picker } from 'neotest-playwright.pickers';
import { options } from './adapter-options';
import { logger } from './logging';
import { loadProjectCache, saveProjectCache } from './persist';
import { get_config } from './playwright';
import { selectMultiple } from './select-multiple';

// TODO: document interaction with dynamic test discovery

/** Returns a list of project names */
const parseProjects = (output: P.JSONReport) => {
	const names = output.config.projects.map((p) => p.name);

	return names;
};

/** Returns a list of project names from the cached data. */
export const loadPreselectedProjects = () => {
	const cache = loadProjectCache();

	if (cache) {
		return cache.projects;
	} else {
		return null;
	}
};

export const create_project_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightProject',
		// @ts-expect-error until type is updated
		() => {
			const output = get_config();

			const choices = parseProjects(output);

			let preselected: string[] = [];

			// if options.persist_project_selection is false, avoid loading from cache
			// even if it exists
			if (options.persist_project_selection) {
				preselected = loadPreselectedProjects() ?? [];
			}

			selectProjects(
				choices,
				preselected,
				(selection) => {
					setProjects(selection);

					logger('info', 'selectProjects', selection);

					// trigger data refresh in subprocess
					vim.api.nvim_command('NeotestPlaywrightRefresh');
				},
				options.experimental.use_telescope,
			);
		},
		{
			nargs: 0,
		},
	);
};

const selectProjects = (
	choices: string[],
	preselected: string[],
	on_select: (selection: string[]) => void,
	use_telescope = false,
) => {
	const prompt = 'Select projects to include in the next test run:';

	if (use_telescope) {
		show_picker(
			{},
			{
				prompt: prompt,
				choices: choices,
				preselected: preselected,
				on_select: (selection) => on_select(selection),
			},
		);
	} else {
		const choice = selectMultiple({
			prompt,
			choices,
			initial: 'all',
			preselected,
		});
		on_select(choice as string[]);
	}
};

const setProjects = (projects: string[]) => {
	logger('debug', 'setProjects', projects);

	if (options.persist_project_selection) {
		saveProjectCache({ projects });
	}

	options.projects = projects;
};
