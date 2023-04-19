import type * as P from '@playwright/test/reporter';
import * as lib from 'neotest.lib';

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
