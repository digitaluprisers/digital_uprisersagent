import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';

const plugin = {
	meta: {
		name: 'Digital Uprisers-local-rules',
	},
	configs: {},
	// @ts-expect-error Rules type does not match for typescript-eslint and eslint
	rules: rules as ESLint.Plugin['rules'],
} satisfies ESLint.Plugin;

export const localRulesPlugin = {
	...plugin,
	configs: {
		recommended: {
			plugins: {
				'Digital Uprisers-local-rules': plugin,
			},
			rules: {
				'Digital Uprisers-local-rules/no-uncaught-json-parse': 'error',
				'Digital Uprisers-local-rules/no-json-parse-json-stringify': 'error',
				'Digital Uprisers-local-rules/no-unneeded-backticks': 'error',
				'Digital Uprisers-local-rules/no-interpolation-in-regular-string': 'error',
				'Digital Uprisers-local-rules/no-unused-param-in-catch-clause': 'error',
				'Digital Uprisers-local-rules/no-useless-catch-throw': 'error',
			},
		},
	},
} satisfies ESLint.Plugin;
