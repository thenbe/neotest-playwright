import { parseOutput } from 'neotest-playwright/report';
import * as logger from 'neotest.logging';
import { readReport } from './report-io';
import type { Adapter } from './types/adapter';

export const results = ((spec, result, _tree) => {
	if (result.code === 129) {
		// Code 129: User stopped the test run
		logger.debug('Code 129: User stopped the test run. Aborting result parse');
		return {};
	}

	const resultsPath = spec.context.results_path;

	const decoded = readReport(resultsPath);

	const results = parseOutput(decoded);

	return results;
}) satisfies Adapter['results'];
