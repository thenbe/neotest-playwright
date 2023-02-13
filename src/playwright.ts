import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { buildCommand } from './build-command';
import { emitError } from './helpers';

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

	// TODO: Consider reading from report file once pre-run
	// resolution is implemented.
	const output = run(cmd.join(' '));

	return output;
};

// TODO: DRY with get_projects
export const getTests = () => {
	let path = vim.fn.expand('%:p');

	if (path === '') {
		path = vim.fn.getcwd();
	}

	const cmd = buildCommand(
		{
			bin: options.get_playwright_command(path),
			config: options.get_playwright_config(path),
			reporters: ['json'],
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
		emitError(`Failed to execute command: ${cmd}`);
		return;
	}

	const output = handle.read('*a');
	handle.close();

	if (typeof output !== 'string') {
		emitError(`Failed to read output from command: ${cmd}`);
		return;
	}

	if (output === '') {
		emitError(`No output from command: ${cmd}`);
		return;
	}

	// TODO: difference VS vim.json.decode
	const parsed = vim.fn.json_decode(output);

	return parsed;
};
