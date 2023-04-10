import * as neotest_logger from 'neotest.logging';

type LogLevel = keyof typeof neotest_logger;

/** Wrapper around `neotest.logging` that adds a prefix to the log message. */
export const logger = (
	level: LogLevel,
	message: string,
	...args: unknown[]
) => {
	const prefix = '[neotest-playwright]';

	neotest_logger[level](`${prefix} ${message}`, ...args);
};
