import { test, expect } from '@playwright/test';

test.describe('math', () => {
	test('addition', async ({ page }) => {
		expect(1 + 1).toBe(2);
	});

	test('not substraction', async ({ page }) => {
		expect(1 - 1).toBe(11);
	});
});

test('common sense', async ({ page }) => {
	expect(true).toBe(true);
});

test('not so common sense', async ({ page }) => {
	expect(true).toBe(false);
});
