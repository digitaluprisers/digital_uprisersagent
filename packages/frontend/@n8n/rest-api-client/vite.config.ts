import { defineConfig, mergeConfig } from 'vite';
import { createVitestConfig } from '@Digital Uprisers/vitest-config/frontend';

export default mergeConfig(defineConfig({}), createVitestConfig({ setupFiles: [] }));
