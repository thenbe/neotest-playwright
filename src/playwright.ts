import type * as P from '@playwright/test/reporter';
import { options } from './adapter-options';
import { buildCommand } from './build-command';
import { emitError } from './helpers';
import { logger } from './logging';

export const get_config = () => {
	const cmd = buildCommand(
		{
			bin: options.get_playwright_binary(),
			config: options.get_playwright_config(),
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

	const jsonMatch = string.match(output, "%b{}");

	if (!jsonMatch) {
		emitError(`Failed to parse JSON output: ${output}`);
		return;
	}

	const jsonString = jsonMatch[0];

	try {
		const decoded = vim.fn.json_decode(jsonString) as P.JSONReport;
		return decoded;
	} catch (err) {
		if (err instanceof Error) {
			emitError(`Failed to decode JSON: ${err.message}`);
		}
		return;
	}
};
