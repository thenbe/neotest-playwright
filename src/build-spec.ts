import type * as neotest from 'neotest';
import * as util from 'neotest-playwright.util';
import {
	buildCommand,
	CommandOptions,
	COMMAND_PRESETS,
} from 'neotest-playwright/build-command';
import { parseOutput } from 'neotest-playwright/report';
import * as async from 'neotest.async';
import * as lib from 'neotest.lib';

// @ts-ignore
export const buildSpec: neotest.Adapter['build_spec'] = (args) => {
	if (!args) {
		print('No args');
		return;
	}

	if (!args.tree) {
		print('No args.tree');
		return;
	}

	const pos = args.tree.data();

	// playwright supports running tests by line number: file.spec.ts:123
	let testFilter =
		pos.type === 'test' || pos.type === 'namespace'
			? `${pos.path}:${pos.range[0] + 1}`
			: pos.path;

	const binary = getBinary(pos.path);
	const config = getConfig(pos.path);

	// TODO: Document usage of preset. Show example/gif with page.pause()
	// TODO: find better way to get preset name.
	const presetName = args.extra_args?.find((x) => x.startsWith('preset='));

	const preset =
		presetName === 'preset=headed'
			? COMMAND_PRESETS['COMMAND_HEADED']
			: COMMAND_PRESETS['COMMAND_DEFAULT'];

	const commandOptions: CommandOptions = {
		...preset,
		testFilter: testFilter,
	};

	if (config && lib.files.exists(config)) {
		commandOptions.config = config;
	}

	// const env = getEnv(args[2]?.env || {});

	// TODO: move extra_args to buildCommand.
	// TODO: Don't include preset in extra_args
	// if (args.extra_args) {
	// 	command.push(...args.extra_args);
	// }

	const resultsPath = `${async.fn.tempname()}.json`;

	const command = [binary, ...buildCommand(commandOptions)];

	// @ts-ignore
	print(vim.inspect(command));

	lib.files.write(resultsPath, '');

	const [streamData, stopStream] = lib.files.stream(resultsPath);

	return {
		command,
		cwd: null, // TODO: get from user config
		context: {
			results_path: resultsPath,
			file: pos.path,
			stop_stream: stopStream,
		},

		// TODO: what's the difference between stream and Adapter.Result?
		stream: () => () => {
			const newResults = streamData();

			// @ts-ignore
			const json = vim.json as IVimExtended['json'];

			const [ok, report] = pcall(json.decode, newResults, {
				luanil: { object: true },
			});

			if (!ok) {
				print('Error parsing results');
				print(newResults);
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
const getBinary = (filePath: string) => {
	print('getBinary', filePath);
	const node_modules =
		util.find_ancestor(filePath, 'node_modules', true) + '/node_modules';
	const bin = `${node_modules}/.bin/playwright`; // TODO: , don't hardcode, get from user config

	if (lib.files.exists(bin)) {
		return bin;
	} else {
		return 'pnpm playwright'; // TODO: don't hardcode
	}
};

const getConfig = (filePath: string) => {
	const configDir = util.find_ancestor(filePath, 'playwright.config.ts', false);
	const config = `${configDir}/playwright.config.ts`; // TODO: don't hardcode

	if (lib.files.exists(config)) {
		return config;
	}

	print('Unable to locate config file.', config);

	return null;
};
