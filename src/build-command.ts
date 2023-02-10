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
export const buildCommand = (options: CommandOptions, extraArgs: string[]) => {
	const o = options;

	const command: string[] = [];

	command.push(o.bin);
	command.push('test');
	command.push(`--reporter=json`);
	if (o.debug === true) command.push('--debug');
	if (o.headed === true) command.push('--headed');
	if (o.retries !== undefined) command.push(`--retries=${o.retries}`);
	if (o.abortOnFailure === true) command.push('-x');
	if (o.workers !== undefined) command.push(`--workers=${o.workers}`);
	if (o.timeout !== undefined) command.push(`--timeout=${o.timeout}`);
	if (o.config !== undefined) command.push(`--config=${o.config}`);
	if (o.projects !== undefined) {
		for (const project of o.projects) {
			command.push(`--project=${project}`);
		}
	}
	command.push(...extraArgs);
	if (o.testFilter !== undefined) command.push(o.testFilter);

	logger.debug('neotest-playwright command', command);

	return command;
};
