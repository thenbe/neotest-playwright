import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';
import { cleanAnsi } from 'neotest-playwright.util';
import { options } from './adapter-options';
import { emitError } from './helpers';

// ### Output ###

export const decodeOutput = (data: string): P.JSONReport => {
	const [ok, parsed] = pcall(vim.json.decode, data, {
		luanil: { object: true },
	});

	if (!ok) {
		emitError('Failed to parse test output json');
		throw new Error('Failed to parse test output json');
	}

	return parsed as P.JSONReport;
};

export const parseOutput = (report: P.JSONReport): neotest.Results => {
	if (report.errors.length > 1) {
		emitError('Global errors found in report');
	}

	const all_results = new Map<string, neotest.Result>();

	// Multiple suites at root level may occur if (a) testDir is omitted from
	// config or (b) project "dependencies" have been set in config.

	for (const suite of report.suites) {
		const results = parseSuite(suite, report);
		for (const [key, result] of Object.entries(results)) {
			all_results.set(key, result);
		}
	}

	if (all_results.size === 0) {
		emitError('No test suites found in report');
	}

	return Object.fromEntries(all_results);
};

// ### Suite ###

export const parseSuite = (
	suite: P.JSONReportSuite,
	report: P.JSONReport,
): neotest.Results => {
	const results: neotest.Results = {};

	const specs = flattenSpecs([suite]);

	// Parse specs
	for (const spec of specs) {
		let key: string;
		if (options.enable_dynamic_test_discovery) {
			key = spec.id;
		} else {
			key = constructSpecKey(report, spec);
		}

		results[key] = parseSpec(spec);
	}

	return results;
};

// export const flattenSpecs = (suite: P.JSONReportSuite) => {
// 	let specs = suite.specs.map((spec) => ({ ...spec, suiteTitle: suite.title }));
//
// 	for (const nestedSuite of suite.suites ?? []) {
// 		specs = specs.concat(flattenSpecs(nestedSuite));
// 	}
//
// 	return specs;
// };

export const flattenSpecs = (
	suites: P.JSONReportSuite[],
): P.JSONReportSpec[] => {
	let specs: P.JSONReportSpec[] = [];

	for (const suite of suites) {
		const suiteSpecs = suite.specs.map((spec) => ({
			...spec,
			suiteTitle: suite.title,
		}));
		specs = specs.concat(suiteSpecs, flattenSpecs(suite.suites ?? []));
	}

	return specs;
};

// ### Spec ###

export const parseSpec = (
	spec: P.JSONReportSpec,
): Omit<neotest.Result, 'output'> => {
	const status = getSpecStatus(spec);
	const errors = collectSpecErrors(spec).map((s) => toNeotestError(s));
	const attachments = spec.tests[0]?.results[0]?.attachments ?? []; // TODO: handle multiple tests/results (test runs)

	const data = {
		status,
		short: `${spec.title}: ${status}`,
		errors,
		attachments,
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
	const line = error.location?.line;
	return {
		message: cleanAnsi(error.message),
		line: line ? line - 1 : 0,
	};
};
