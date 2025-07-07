import { defineConfig } from 'eslint/config';
import { nodeConfig } from '@Digital Uprisers/eslint-config/node';

export default defineConfig(nodeConfig, {
	rules: {
		// TODO: Remove this
		'no-prototype-builtins': 'warn',
		'@typescript-eslint/require-await': 'warn',
	},
});
