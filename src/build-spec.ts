import type * as neotest from 'neotest';
import * as util from 'neotest-playwright.util';
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

	const binary = getBinary(pos.path);
	const config = getConfig(pos.path);

	const command = [binary, 'test', '--reporter=json'];

	if (config && lib.files.exists(config)) {
		command.push(`--config=${config}`);
	}

	// const env = getEnv(args[2]?.env || {});

	let testFilter =
		pos.type === 'test' || pos.type === 'namespace'
			? `${pos.path}:${pos.range[0] + 1}`
			: pos.path;

	command.push(testFilter);

	if (args.extra_args) {
		command.push(...args.extra_args);
	}

	const resultsPath = `${async.fn.tempname()}.json`;

	lib.files.write(resultsPath, '');

	const [streamData, stopStream] = lib.files.stream(resultsPath);

	// @ts-ignore
	print(vim.inspect(command));

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
