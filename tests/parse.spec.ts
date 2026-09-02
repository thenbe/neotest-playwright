/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';
import { expect, test, vi } from 'vitest';
import * as report from '../src/report';
import sample from './sample/report.json';

vi.mock('neotest-playwright.util', () => ({
	cleanAnsi: (value: string) => value,
}));

vi.mock('../src/adapter-options', () => ({
	options: { enable_dynamic_test_discovery: false },
}));

vi.mock('../src/helpers', () => ({
	emitError: () => undefined,
}));

test('parse report', () => {
	const results = report.parseOutput(sample as unknown as P.JSONReport);

	const expected = {
		'/home/user/project/tests/example.spec.ts::addition': {
			status: 'passed',
			short: 'addition: passed',
			errors: [],
			attachments: [],
		},
		'/home/user/project/tests/example.spec.ts::not substraction': {
			status: 'failed',
			short: 'not substraction: failed',
			errors: expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringMatching('Error: '),
					line: 8,
				}),
			]),
			attachments: [],
		},
		'/home/user/project/tests/example.spec.ts::common sense': {
			status: 'passed',
			short: 'common sense: passed',
			errors: [],
			attachments: [],
		},
		'/home/user/project/tests/example.spec.ts::not so common sense': {
			status: 'failed',
			short: 'not so common sense: failed',
			errors: expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringMatching('Error: '),
					line: 17,
				}),
			]),
			attachments: [],
		},
	} satisfies neotest.Results;

	expect(results).toStrictEqual(expected);
});
