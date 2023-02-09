import type * as P from '@playwright/test/reporter';
import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { selectMultiple } from './select-multiple';

// TODO: replace vim.notify with logger.debug

/** Returns the playwright config */
const get_projects = () => {
	const testFilter = './does-not-exist';
	const cmd = `npx playwright test --list --reporter=json ${testFilter} `;

	const [handle, errmsg] = io.popen(cmd);

	if (typeof errmsg === 'string') {
		vim.notify(errmsg, vim.log.levels.ERROR, {});
	}

	if (!handle) {
		vim.notify(`Failed to execute command: ${cmd}`, vim.log.levels.ERROR, {});
		return;
	}

	const output = handle.read('*a');
	handle.close();

	// print(output);

	if (typeof output !== 'string') {
		vim.notify(
			`Failed to read output from command: ${cmd}`,
			vim.log.levels.ERROR,
			{},
		);
		return;
	}

	if (output === '') {
		vim.notify(`No output from command: ${cmd}`, vim.log.levels.ERROR, {});
		return;
	}

	const parsed = vim.fn.json_decode(output);

	return parsed;
};

/** Returns a list of project names */
const parseProjects = (output: P.JSONReport) => {
	const names = output.config.projects.map((p) => p.name);

	return names;
};

export const create_project_command = () => {
	vim.api.nvim_create_user_command(
		'NeotestPlaywrightProject',
		// @ts-expect-error until type is updated
		() => {
			const output = get_projects();
			const options = parseProjects(output);
			const selection = selectProjects(options);
			setProjects(selection);
		},
		{
			nargs: 0,
		},
	);
};

const selectProjects = (options: string[]) => {
	const prompt = 'Select projects to include in the next test run:';

	const choice = selectMultiple({ prompt, options, initial: 'all' });

	logger.debug('neotest-playwright project', choice);

	vim.notify(
		`Selected projects: ${vim.inspect(choice, {})}`,
		vim.log.levels.DEBUG,
		{},
	);

	// TODO: rm type cast
	return choice as string[];
};

const setProjects = (projects: string[]) => {
	logger.debug('neotest-playwright project', projects);

	// if (options.persist_project_selection) {
	// 	saveConfig({ projects });
	// }
	saveConfig({ projects });

	options.projects = projects;
};

interface DataFile {
	[path: string]: Data;
}

interface Data {
	projects: string[];
}

/** Persists the selected projects to disk. Project selection is scoped
 * to project directory. */
const saveConfig = (data: Data) => {
	// persist the selected projects for the current project
	const dataPath = vim.fn.stdpath('data');
	const dataFile = `${dataPath}/neotest-playwright.json`;

	// don't overwrite the existing data for other projects
	const existing = vim.fn.readfile(dataFile);

	const existingData: DataFile =
		existing.length > 0 ? vim.fn.json_decode(existing[0]) : {};

	const path = vim.fn.getcwd();

	existingData[path] = data;

	logger.info('neotest-playwright save(): Saving data to', dataFile);

	vim.fn.writefile([vim.fn.json_encode(existingData)], dataFile);
};
