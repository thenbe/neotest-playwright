/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type * as P from '@playwright/test/reporter';
import type * as neotest from 'neotest';
import { expect, test } from 'vitest';
import * as report from '../src/report';
import sample from './sample/report.json';

test('parse report', () => {
	const results = report.parseOutput(sample as unknown as P.JSONReport);

	const expected = {
		'/home/user/project/tests/example.spec.ts::addition': {
			status: 'passed',
			short: 'addition: passed',
			errors: [],
		},
		'/home/user/project/tests/example.spec.ts::not substraction': {
			status: 'failed',
			short: 'not substraction: failed',
			errors: expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringMatching('Error: '),
					line: 9,
				}),
			]),
		},
		'/home/user/project/tests/example.spec.ts::common sense': {
			status: 'passed',
			short: 'common sense: passed',
			errors: [],
		},
		'/home/user/project/tests/example.spec.ts::not so common sense': {
			status: 'failed',
			short: 'not so common sense: failed',
			errors: expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringMatching('Error: '),
					line: 18,
				}),
			]),
		},
	} satisfies neotest.Results;

	expect(results).toStrictEqual(expected);
});
