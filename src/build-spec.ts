import { buildCommand, CommandOptions } from 'neotest-playwright/build-command';
import * as async from 'neotest.async';
import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { COMMAND_PRESETS } from './preset-options';
import type { Adapter } from './types/adapter';

export const buildSpec: Adapter['build_spec'] = (args) => {
	if (!args) {
		logger.error('No args');
		return;
	}

	if (!args.tree) {
		logger.error('No args.tree');
		return;
	}

	const pos = args.tree.data();

	// playwright supports running tests by line number: file.spec.ts:123
	let testFilter =
		pos.type === 'test' || pos.type === 'namespace'
			? `${pos.path}:${pos.range[0] + 1}`
			: pos.path;

	const commandOptions: CommandOptions = {
		...COMMAND_PRESETS[options.preset],
		bin: options.get_playwright_command(pos.path),
		config: options.get_playwright_config(pos.path),
		projects: options.projects,
		testFilter: testFilter,
	};

	const resultsPath = `${async.fn.tempname()}.json`;

	const extraArgs = getExtraArgs(args.extra_args, options.extra_args);

	return {
		command: buildCommand(commandOptions, extraArgs),
		cwd:
			typeof options.get_cwd === 'function' ? options.get_cwd(pos.path) : null,
		context: {
			results_path: resultsPath,
			file: pos.path,
		},
		// strategy: getStrategyConfig(
		// 	getDefaultStrategyConfig(args.strategy, command, cwd) || {},
		// 	args,
		// ),
		env: {
			PLAYWRIGHT_JSON_OUTPUT_NAME: resultsPath,
			...options.env,
		},
	};
};

const getExtraArgs = (...argArrays: (string[] | undefined)[]): string[] => {
	const args: string[] = [];

	for (const argArray of argArrays) {
		for (const arg of argArray || []) {
			if (typeof arg === 'string' && arg.length > 0) {
				args.push(arg);
			}
		}
	}

	return args;
};
