import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@Digital Uprisers/vitest-config/node';

export default mergeConfig(defineConfig({}), vitestConfig);
