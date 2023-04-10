import type { CommandOptions } from 'neotest-playwright/build-command';
import { buildCommand } from 'neotest-playwright/build-command';
import * as async from 'neotest.async';
import { options } from './adapter-options';
import { COMMAND_PRESETS } from './preset-options';
import type { Adapter } from './types/adapter';

export const buildSpec: Adapter['build_spec'] = (args) => {
	const pos = args.tree.data();

	// playwright supports running tests by line number: file.spec.ts:123

	let testFilter: string;

	if (pos.type === 'dir' || pos.type === 'file') {
		testFilter = pos.path;
	} else {
		let line: number;

		if ('range' in pos) {
			line = pos.range[0] + 1;
		} else {
			// This is a range-less position. To get the correct test filter, we
			// need to find the nearest test position with a non-null range.
			// https://github.com/nvim-neotest/neotest/pull/172
			const range = args.tree.closest_value_for('range') as Range;
			line = range[0] + 1;
		}

		testFilter = `${pos.path}:${line}`;
	}

	const projects = pos.project_id ? [pos.project_id] : options.projects;

	const commandOptions: CommandOptions = {
		...COMMAND_PRESETS[options.preset],
		bin: options.get_playwright_binary(),
		config: options.get_playwright_config(),
		projects,
		testFilter: testFilter,
	};

	const resultsPath = `${async.fn.tempname()}.json`;

	const extraArgs = getExtraArgs(args.extra_args, options.extra_args);

	return {
		command: buildCommand(commandOptions, extraArgs),
		cwd: typeof options.get_cwd === 'function' ? options.get_cwd() : null,
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

const getExtraArgs = (...args: (string[] | undefined)[]): string[] => {
	const extraArgs = args.filter((arg) => arg !== undefined) as string[][];
	return ([] as string[]).concat(...extraArgs);
};
