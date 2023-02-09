import type * as neotest from 'neotest';
import { parseOutput } from 'neotest-playwright/report';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';

export const results = ((spec, _result, _tree) => {
	spec.context?.stop_stream();

	const resultsPath = spec.context?.results_path;

	const [success, data] = pcall(lib.files.read, resultsPath);

	if (!success) {
		logger.error('No test output file found', resultsPath);
		return {};
	}

	const [ok, parsed] = pcall(vim.json.decode, data, {
		luanil: { object: true },
	});

	if (!ok) {
		logger.error('Failed to parse test output json', resultsPath);
		return {};
	}

	const results = parseOutput(parsed, resultsPath);

	return results;
}) satisfies neotest.Adapter['results'];
