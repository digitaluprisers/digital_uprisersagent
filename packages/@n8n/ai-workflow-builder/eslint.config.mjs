import { defineConfig } from 'eslint/config';
import { nodeConfig } from '@Digital Uprisers/eslint-config/node';

export default defineConfig(nodeConfig, {
	rules: {
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],
		complexity: 'error',
		'@typescript-eslint/require-await': 'warn',
		'@typescript-eslint/naming-convention': 'warn',
	},
});
