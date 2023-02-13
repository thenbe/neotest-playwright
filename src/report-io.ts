import type * as P from '@playwright/test/reporter';
import * as lib from 'neotest.lib';
import * as logger from 'neotest.logging';

export const readReport = (file: string) => {
	const [success, data] = pcall(lib.files.read, file);

	if (!success) {
		logger.error('No test output file found', file);
		throw new Error('No test output file found');
	}

	const [ok, parsed] = pcall(vim.json.decode, data, {
		luanil: { object: true },
	});

	if (!ok) {
		logger.error('Failed to parse test output json', file);
		throw new Error('Failed to parse test output json');
	}

	return parsed as P.JSONReport;
};

export const writeReport = (file: string, report: P.JSONReport) => {
	const code = vim.fn.writefile([vim.fn.json_encode(report)], file);

	if (code !== 0) {
		logger.error('Failed to write test output json', file);
		return false;
	} else {
		logger.debug('writeReport', file);
		return true;
	}
};
