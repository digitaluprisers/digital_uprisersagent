import { defineConfig } from 'eslint/config';
import { baseConfig } from '@Digital Uprisers/eslint-config/base';

export default defineConfig(baseConfig, {
	rules: {
		'unicorn/filename-case': ['error', { case: 'kebabCase' }],

		// TODO: Remove this
		'@typescript-eslint/naming-convention': 'warn',
		'@typescript-eslint/no-empty-object-type': 'warn',
	},
});
