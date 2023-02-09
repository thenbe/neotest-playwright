import * as logger from 'neotest.logging';

interface DataFile {
	[path: string]: Data;
}

interface Data {
	projects: string[];
}

/** Persists the selected projects to disk. Project selection is scoped
 * to project directory. */
export const saveConfig = (data: Data) => {
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
