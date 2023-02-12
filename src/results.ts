import { parseOutput } from 'neotest-playwright/report';
import { readReport } from './report-io';
import type { Adapter } from './types/adapter';

export const results = ((spec, result, _tree) => {
	const resultsPath = spec.context.results_path;

	const decoded = readReport(resultsPath, result);

	// @ts-expect-error throw?
	const results = parseOutput(decoded);

	return results;
}) satisfies Adapter['results'];
