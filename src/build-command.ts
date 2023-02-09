export interface CommandOptions {
	debug?: boolean;
	headed?: boolean;
	retries?: number;
	abortOnFailure?: boolean;
	workers?: number;
	timeout?: number;
	config?: string;
	projects?: string[];
	testFilter?: string;
}

/** A function that takes in CommandOptions and returns a string. */
export const buildCommand = (options: CommandOptions) => {
	const o = options;

	const command = [
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

	return command.filter((x) => x !== null);
};
