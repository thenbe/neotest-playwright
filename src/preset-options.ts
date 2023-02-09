import type { CommandOptions } from './build-command';

export const PRESET = {
	HEADED: 'headed',
	DEBUG: 'debug',
	NONE: 'none',
} as const;

export type Preset = (typeof PRESET)[keyof typeof PRESET];

export const isPreset = (x: unknown): x is Preset => {
	return Object.values(PRESET).includes(x as Preset);
};

const COMMAND_HEADED = {
	headed: true,
	retries: 0,
	abortOnFailure: true,
	workers: 1,
	timeout: 0,
} satisfies CommandOptions;

const COMMAND_DEBUG = {
	debug: true,
} satisfies CommandOptions;

/** No preset, use default options. */
export const COMMAND_NONE = {} satisfies CommandOptions;

export const COMMAND_PRESETS = {
	headed: COMMAND_HEADED,
	debug: COMMAND_DEBUG,
	none: COMMAND_NONE,
} satisfies Record<Preset, CommandOptions>;
