import * as logger from 'neotest.logging';

export interface CommandOptions {
	bin: string;
	debug?: boolean;
	headed?: boolean;
	retries?: number;
	abortOnFailure?: boolean;
	workers?: number;
	timeout?: number;
	config?: string | null;
	projects?: string[];
	testFilter?: string;
}

export type CommandOptionsPreset = Omit<CommandOptions, 'bin'>;

/** A function that takes in CommandOptions and returns a string. */
export const buildCommand = (options: CommandOptions) => {
	const o = options;

	const command = [
		o.bin,
		'test',
		`--reporter=json`,
		o.debug ? '--debug' : null,
		o.headed ? '--headed' : null,
		o.retries ? `--retries=${o.retries}` : null,
		o.abortOnFailure ? '-x' : null,
		o.workers ? `--workers=${o.workers}` : null,
		o.timeout ? `--timeout=${o.timeout}` : null,
		o.config ? `--config=${o.config}` : null,
		o.projects
			? o.projects.map((project) => `--project=${project}`).join(' ')
			: null,
		o.testFilter ? `${o.testFilter}` : null,
	];

	const filtered = command.filter((x): x is string => {
		return typeof x === 'string' && x.length > 0;
	});

	logger.debug('neotest-playwright command', command);

	return filtered;
};
