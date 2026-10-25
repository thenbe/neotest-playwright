import type * as P from '@playwright/test/reporter';
import { options } from './adapter-options';
import { buildCommand } from './build-command';
import { emitError } from './helpers';
import { logger } from './logging';

export const get_config = (path?: string) => {
	const cmd = buildCommand(
		{
			bin: options.get_playwright_binary(path),
			config: options.get_playwright_config(path),
			reporters: ['json'],
		},
		['--list'],
	);

	// apply any custom environment variables when resolving the config
	cmd.unshift(
		Object.entries(options.env)
			.map(([key, value]) => `${key}=${value}`)
			.join(' '),
	);

	const cwd = options.get_cwd?.(path);
	const output = run(
		(cwd ? `cd ${vim.fn.shellescape(cwd)} && ` : '') + cmd.join(' '),
	);

	if (!output) {
		throw new Error('Failed to get Playwright config');
	}
	if (output.errors.length > 0) {
		throw new Error(
			'Playwright test discovery failed; check the Playwright list command',
		);
	}

	return output;
};

/** Returns the playwright config */
const run = (cmd: string) => {
	const [handle, errmsg] = io.popen(cmd);

	if (typeof errmsg === 'string') {
		logger('error', errmsg);
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
