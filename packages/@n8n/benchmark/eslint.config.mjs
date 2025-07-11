import { defineConfig, globalIgnores } from 'eslint/config';
import { nodeConfig } from '@Digital Uprisers/eslint-config/node';

export default defineConfig(
	nodeConfig,
	globalIgnores(['scenarios/**', 'scripts/**']),
	{
		rules: {
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
			'Digital Uprisers-local-rules/no-plain-errors': 'off',
			complexity: 'error',
			'@typescript-eslint/naming-convention': 'warn',
			'no-empty': 'warn',
		},
	},
	{
		files: ['./src/commands/*.ts'],
		rules: {
			'import-x/no-default-export': 'off',
		},
	},
);
