import * as util from 'neotest-playwright.util';
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
		bin: getPlaywrightBinary(pos.path),
		config: getConfig(pos.path),
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

// Alt: use setmetatable to get value from user config
const getPlaywrightBinary = (filePath: string) => {
	const node_modules =
		util.find_ancestor(filePath, 'node_modules', true) + '/node_modules';
	const bin = `${node_modules}/.bin/playwright`; // TODO: , don't hardcode, get from user config

	if (lib.files.exists(bin)) {
		logger.debug('playwright binary exists', bin);
		return bin;
	} else {
		logger.warn('playwright binary does not exist', bin);
		return 'pnpm playwright'; // TODO: don't hardcode
	}
};

const getConfig = (filePath: string) => {
	const configDir = util.find_ancestor(filePath, 'playwright.config.ts', false);
	const config = `${configDir}/playwright.config.ts`; // TODO: don't hardcode

	if (lib.files.exists(config)) {
		logger.debug('playwright config', config);
		return config;
	}

	logger.warn('Unable to locate config file.', config);

	return null;
};
