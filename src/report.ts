import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';

// ### Output ###

export const parseOutput = (
	report: P.JSONReport,
	output: neotest.Result['output'],
): neotest.Results => {
	// if (report.errors.length > 1) {
	// 	console.log('Encountered global errors');
	// }

	const root = report.suites[0];

	// if (!root) {
	// 	console.log('No test suites found in report');
	// }

	const results = parseSuite(root!, report, output);

	return results;
};

// ### Suite ###

export const parseSuite = (
	suite: P.JSONReportSuite,
	report: P.JSONReport,
	output: neotest.Result['output'],
): neotest.Results => {
	let results: neotest.Results = {};

	for (const spec of suite.specs) {
		const key = constructSpecKey(report, spec);

		const specResults = parseSpec(spec);

		results[key] = {
			...specResults,

			// all suites have the same output file path
			output,
		};
	}

	// Recursively parse child suites
	for (const child of suite.suites ?? []) {
		const childResults = parseSuite(child, report, output);
		results = { ...results, ...childResults };
	}

	return results;
};

// ### Spec ###

export const parseSpec = (
	spec: P.JSONReportSpec,
): Omit<neotest.Result, 'output'> => {
	const status = getSpecStatus(spec);
	const errors = collectSpecErrors(spec).map((s) => toNeotestError(s));

	const data = {
		status,
		short: `${spec.title}: ${status}`,
		errors,
	};

	return data;
};

const getSpecStatus = (spec: P.JSONReportSpec): neotest.Result['status'] => {
	if (!spec.ok) {
		return 'failed';
	} else if (spec.tests[0]?.status === 'skipped') {
		return 'skipped';
	} else {
		return 'passed';
	}
};

const constructSpecKey = (
	report: P.JSONReport,
	spec: P.JSONReportSpec,
): neotest.ResultKey => {
	const dir = report.config.rootDir;
	const file = spec.file;
	const name = spec.title;

	// FIX: fix identification issue. `neotest.lib.treesitter.parse_positions`
	// has `position_id` parameter we might be able to use.
	const key = `${dir}/${file}::${name}`;

	return key;
};

/** Collect all errors from a spec by traversing spec -> tests[] -> results[].
 * Return a single flat array containing any errors. */
const collectSpecErrors = (spec: P.JSONReportSpec): P.JSONReportError[] => {
	const errors: P.JSONReportError[] = [];

	for (const test of spec.tests) {
		for (const result of test.results) {
			errors.push(...result.errors);
		}
	}

	return errors;
};

/** Convert Playwright error to neotest error */
const toNeotestError = (error: P.JSONReportError): neotest.Error => {
	return {
		message: error.message,
		line: error.location?.line ?? 0,
	};
};
