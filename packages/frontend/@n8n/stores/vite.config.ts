import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@Digital Uprisers/vitest-config/frontend';

export default mergeConfig(defineConfig({}), vitestConfig);
