const sharedOptions = require('@Digital Uprisers/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@Digital Uprisers/eslint-config/base', 'plugin:playwright/recommended'],

	...sharedOptions(__dirname),

	plugins: ['playwright'],

	env: {
		node: true,
	},

	rules: {
		// TODO: remove these rules
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/promise-function-async': 'off',
		'Digital Uprisers-local-rules/no-uncaught-json-parse': 'off',
		'playwright/expect-expect': 'warn',
		'playwright/max-nested-describe': 'warn',
		'playwright/no-conditional-in-test': 'warn',
		'playwright/no-skipped-test': 'warn',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/tests/**', '**/e2e/**', '**/playwright/**'],
				optionalDependencies: false,
			},
		],
	},
};
