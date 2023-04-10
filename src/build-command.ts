import { logger } from './logging';

export interface CommandOptions {
	bin: string;
	debug?: boolean;
	headed?: boolean;
	retries?: number;
	abortOnFailure?: boolean;
	workers?: number;
	timeout?: number;
	config?: string | null;
	reporters?: string[];
	projects?: string[];
	testFilter?: string;
}

export type CommandOptionsPreset = Omit<CommandOptions, 'bin'>;

/** A function that takes in CommandOptions and returns a string. */
export const buildCommand = (options: CommandOptions, extraArgs: string[]) => {
	const o = options;
	const reporters = o.reporters ?? ['list', 'json'];
	const reportersArg = buildReporters(reporters);

	const command: string[] = [];

	command.push(o.bin);
	command.push('test');
	if (reportersArg !== null) command.push(reportersArg);
	if (o.debug === true) command.push('--debug');
	if (o.headed === true) command.push('--headed');
	if (o.retries !== undefined) command.push(`--retries=${o.retries}`);
	if (o.abortOnFailure === true) command.push('-x');
	if (o.workers !== undefined) command.push(`--workers=${o.workers}`);
	if (o.timeout !== undefined) command.push(`--timeout=${o.timeout}`);
	if (o.config !== undefined) command.push(`--config=${o.config}`);
	if (o.projects !== undefined) {
		for (const project of o.projects) {
			if (typeof project === 'string' && project.length > 0) {
				command.push(`--project=${project}`);
			}
		}
	}
	command.push(...extraArgs);
	if (o.testFilter !== undefined) command.push(o.testFilter);

	logger('debug', 'command', command);

	return command;
};

/** Returns `--reporter=${reporters[0]},${reporters[1]},...` */
const buildReporters = (reporters: string[]) => {
	if (reporters.length === 0) {
		return null;
	} else {
		return `--reporter=${reporters.join(',')}`;
	}
};
