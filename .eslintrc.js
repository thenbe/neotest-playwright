/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',

		// https://mysticatea.github.io/eslint-plugin-eslint-comments/
		'plugin:eslint-comments/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				destructuredArrayIgnorePattern: '^_',
				ignoreRestSiblings: true,
				argsIgnorePattern: '^_',
			},
		],

		// https://eslint.org/docs/latest/rules/prefer-const#options
		'prefer-const': [
			'error',
			{ destructuring: 'all', ignoreReadBeforeAssign: false },
		],

		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{ allowBoolean: true },
		],

		// Better stack traces (at the cost of a bit of performance)
		'no-return-await': 'off',
		'@typescript-eslint/return-await': ['warn', 'always'],

		'@typescript-eslint/promise-function-async': 'warn',

		'@typescript-eslint/ban-ts-comment': 'warn',

		'@typescript-eslint/consistent-type-exports': 'error',
		'@typescript-eslint/consistent-type-imports': [
			'error',
			// we need this for the declaration files (*.d.ts)
			{ disallowTypeAnnotations: false },
		],

		'@typescript-eslint/prefer-readonly': 'warn',
		'@typescript-eslint/member-ordering': 'warn',
		'@typescript-eslint/require-array-sort-compare': 'warn',
		'@typescript-eslint/prefer-regexp-exec': 'warn',
		'@typescript-eslint/switch-exhaustiveness-check': 'warn',

		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],

		'eslint-comments/no-unused-disable': 'error',
	},
};
