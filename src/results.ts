import { decodeOutput, parseOutput } from 'neotest-playwright/report';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';
import type { Adapter } from './types/adapter';

export const results = ((spec, _result, _tree) => {
	spec.context?.stop_stream();

	const resultsPath = spec.context?.results_path;

	const [success, data] = pcall(lib.files.read, resultsPath);

	if (!success) {
		logger.error('No test output file found', resultsPath);
		throw new Error('No test output file found');
	}

	const decoded = decodeOutput(data);

	const results = parseOutput(decoded, resultsPath);

	return results;
}) satisfies Adapter['results'];
