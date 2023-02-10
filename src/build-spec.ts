import { buildCommand, CommandOptions } from 'neotest-playwright/build-command';
import { parseOutput } from 'neotest-playwright/report';
import * as async from 'neotest.async';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import { options } from './adapter-options';
import { COMMAND_PRESETS } from './preset-options';
import type { Adapter } from './types/adapter';

// @ts-ignore
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

	// const env = getEnv(args[2]?.env || {});

	// TODO: move extra_args to buildCommand.
	// if (args.extra_args) {
	// 	command.push(...args.extra_args);
	// }

	const resultsPath = `${async.fn.tempname()}.json`;

	lib.files.write(resultsPath, '');

	const [streamData, stopStream] = lib.files.stream(resultsPath);

	return {
		command: buildCommand(commandOptions),
		cwd: null, // TODO: get from user config
		context: {
			results_path: resultsPath,
			file: pos.path,
			stop_stream: stopStream,
		},

		// TODO: what's the difference between stream and Adapter.Result?
		stream: () => () => {
			const newResults = streamData();

			const [ok, report] = pcall(vim.json.decode, newResults, {
				luanil: { object: true },
			});

			if (!ok) {
				logger.error('Error parsing results');
				return [];
			}

			return parseOutput(report, resultsPath);
		},
		// strategy: getStrategyConfig(
		// 	getDefaultStrategyConfig(args.strategy, command, cwd) || {},
		// 	args,
		// ),
		env: {
			// TODO: merge with user config
			PLAYWRIGHT_JSON_OUTPUT_NAME: resultsPath,
		},
	};
};
