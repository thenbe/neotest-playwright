import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';
import { cleanAnsi } from 'neotest-playwright.util';
import * as logger from 'neotest.logging';

// ### Output ###

export const decodeOutput = (data: string): P.JSONReport => {
	const [ok, parsed] = pcall(vim.json.decode, data, {
		luanil: { object: true },
	});

	if (!ok) {
		logger.error('Failed to parse test output json');
		throw new Error('Failed to parse test output json');
	}

	return parsed;
};

export const parseOutput = (
	report: P.JSONReport,
	output: neotest.Result['output'],
): neotest.Results => {
	if (report.errors.length > 1) {
		const msg = 'Global errors found in report';
		logger.warn(msg, report.errors);
		vim.defer_fn(
			() => vim.cmd(`echohl WarningMsg | echo "${msg}" | echohl None`),
			0,
		);
	}

	const root = report.suites[0];

	if (!root) {
		const msg = 'No test suites found in report';
		logger.error(msg);
		vim.defer_fn(
			() => vim.cmd(`echohl WarningMsg | echo "${msg}" | echohl None`),
			0,
		);
		return {};
	}

	const results = parseSuite(root, report, output);

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
		const key = constructSpecKey(report, spec, suite);

		const specResults = parseSpec(spec);

		results[key] = specResults;
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

// FIX: fix identification issue. `neotest.lib.treesitter.parse_positions`
// has `position_id` parameter we might be able to use.
const constructSpecKey = (
	report: P.JSONReport,
	spec: P.JSONReportSpec,
	suite: P.JSONReportSuite,
): neotest.ResultKey => {
	const dir = report.config.rootDir;
	const file = spec.file;
	const name = spec.title;
	const suiteName = suite.title;
	const isPartOfDescribe = suiteName !== file;

	let key: string;

	if (isPartOfDescribe) {
		key = `${dir}/${file}::${suiteName}::${name}`;
	} else {
		key = `${dir}/${file}::${name}`;
	}

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
