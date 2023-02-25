import type * as P from '@playwright/test/reporter';
import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { buildCommand } from './build-command';
import { emitError } from './helpers';

// TODO: add performance logging.

export const get_config = () => {
	// For better monorepo support, we try to resolve the
	// playwright binary and playwright config from the current
	// buffer's path. Else, if no buffer is open, we fall back
	// to the current working directory.
	let path = vim.fn.expand('%:p') as string;

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

	if (!output) {
		throw new Error('Failed to get Playwright config');
	}

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

	const decoded = vim.fn.json_decode(output) as P.JSONReport;

	return decoded;
};
