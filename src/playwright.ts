import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { buildCommand } from './build-command';

export const get_projects = () => {
	// For better monorepo support, we try to resolve the
	// playwright binary and playwright config from the current
	// buffer's path. Else, if no buffer is open, we fall back
	// to the current working directory.
	let path = vim.fn.expand('%:p');

	if (path === '') {
		path = vim.fn.getcwd();
	}

	const cmd = buildCommand(
		{
			bin: options.get_playwright_command(path),
			config: options.get_playwright_config(path),
			reporters: ['json'],
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
