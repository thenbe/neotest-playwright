import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { buildCommand } from './build-command';

export const get_projects = () => {
	const filePath = vim.fn.expand('%:p');

	const cmd = buildCommand(
		{
			bin: options.get_playwright_command(filePath),
			config: options.get_playwright_config(filePath),
			testFilter: './does-not-exist',
		},
		['--list'],
	);

	const output = run(cmd.join(' '));

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
