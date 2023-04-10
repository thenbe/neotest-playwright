import type * as P from '@playwright/test/reporter';
import * as lib from 'neotest.lib';
import { emitError } from './helpers';
import { logger } from './logging';

// TODO: Remove dead code

export const readReport = (file: string) => {
	const [success, data] = pcall(lib.files.read, file);

	if (!success) {
		throw new Error(`Failed to read test output file: ${file}`);
	}

	const [ok, parsed] = pcall(vim.json.decode, data, {
		luanil: { object: true },
	});

	if (!ok) {
		throw new Error(`Failed to parse test output json: ${file}`);
	}

	return parsed as P.JSONReport;
};

export const writeReport = (file: string, report: P.JSONReport) => {
	const code = vim.fn.writefile([vim.fn.json_encode(report)], file);

	if (code !== 0) {
		emitError('Failed to write test output json');
		return false;
	} else {
		logger('debug', 'writeReport', file);
		return true;
	}
};
