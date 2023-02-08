export interface CommandOptions {
	headed?: boolean;
	retries?: number;
	abortOnFailure?: boolean;
	workers?: number;
	timeout?: number;
	config?: string;
	projects?: string[];
	reporter?: string;
	testFilter?: string;
}

const COMMAND_DEFAULT = {
	abortOnFailure: false,
	reporter: 'json',
} satisfies CommandOptions;

export const COMMAND_HEADED = {
	headed: true,
	retries: 0,
	abortOnFailure: true,
	workers: 1,
	timeout: 0,
} satisfies CommandOptions;

export const COMMAND_PRESETS = {
	COMMAND_HEADED: COMMAND_HEADED,
	COMMAND_DEFAULT: COMMAND_DEFAULT,
};

/** A function that takes in CommandOptions and returns a string. */
export const buildCommand = (options: CommandOptions) => {
	const o = { ...COMMAND_DEFAULT, ...options };

	const command = [
		'test',
		`--reporter=${o.reporter}`,
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
