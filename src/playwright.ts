import * as logger from 'neotest.logging';

export const get_projects = () => {
	const testFilter = './does-not-exist';
	const cmd = `npx playwright test --list --reporter=json ${testFilter} `;
	const output = run(cmd);
	return output;
};

/** Returns the playwright config */
const run = (cmd: string) => {
	const [handle, errmsg] = io.popen(cmd);

	if (typeof errmsg === 'string') {
		logger.error(errmsg);
	}

	if (!handle) {
		logger.error(`Failed to execute command: ${cmd}`);
		return;
	}

	const output = handle.read('*a');
	handle.close();

	if (typeof output !== 'string') {
		logger.error(`Failed to read output from command: ${cmd}`);
		return;
	}

	if (output === '') {
		logger.error(`No output from command: ${cmd}`);
		return;
	}

	const parsed = vim.fn.json_decode(output);

	return parsed;
};
