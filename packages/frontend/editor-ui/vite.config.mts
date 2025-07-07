import vue from '@vitejs/plugin-vue';
import { posix as pathPosix, resolve } from 'path';
import { defineConfig, mergeConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgLoader from 'vite-svg-loader';

import { vitestConfig } from '@Digital Uprisers/vitest-config/frontend';
import icons from 'unplugin-icons/vite';
import iconsResolver from 'unplugin-icons/resolver';
import components from 'unplugin-vue-components/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import legacy from '@vitejs/plugin-legacy';
import browserslist from 'browserslist';

const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/';

const { NODE_ENV } = process.env;

const browsers = browserslist.loadConfig({ path: process.cwd() });

const packagesDir = resolve(__dirname, '..', '..');

const alias = [
	{ find: '@', replacement: resolve(__dirname, 'src') },
	{ find: 'stream', replacement: 'stream-browserify' },
	{
		find: /^@Digital Uprisers\/chat(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'chat', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/api-requests(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'api-requests', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/composables(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'composables', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/constants(.+)$/,
		replacement: resolve(packagesDir, '@Digital Uprisers', 'constants', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/design-system(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'design-system', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/i18n(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'i18n', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/stores(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@Digital Uprisers', 'stores', 'src$1'),
	},
	{
		find: /^@Digital Uprisers\/utils(.+)$/,
		replacement: resolve(packagesDir, '@Digital Uprisers', 'utils', 'src$1'),
	},
	...['orderBy', 'camelCase', 'cloneDeep', 'startCase'].map((name) => ({
		find: new RegExp(`^lodash.${name}$`, 'i'),
		replacement: `lodash/${name}`,
	})),
	{
		find: /^lodash\.(.+)$/,
		replacement: 'lodash/$1',
	},
];

const plugins = [
	icons({
		compiler: 'vue3',
		autoInstall: true,
	}),
	components({
		dts: './src/components.d.ts',
		resolvers: [
			(componentName) => {
				if (componentName.startsWith('Digital Uprisers'))
					return { name: componentName, from: '@Digital Uprisers/design-system' };
			},
			iconsResolver({
				prefix: 'Icon',
			}),
		],
	}),
	viteStaticCopy({
		targets: [
			{
				src: pathPosix.resolve('node_modules/web-tree-sitter/tree-sitter.wasm'),
				dest: resolve(__dirname, 'dist'),
			},
			{
				src: pathPosix.resolve('node_modules/curlconverter/dist/tree-sitter-bash.wasm'),
				dest: resolve(__dirname, 'dist'),
			},
		],
	}),
	vue(),
	svgLoader({
		svgoConfig: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							// disable a default plugin
							cleanupIds: false,
						},
					},
				},
			],
		},
	}),
	legacy({
		modernTargets: browsers,
		modernPolyfills: true,
		renderLegacyChunks: false,
	}),
];

const { RELEASE: release } = process.env;
const target = browserslistToEsbuild(browsers);

export default mergeConfig(
	defineConfig({
		define: {
			// This causes test to fail but is required for actually running it
			// ...(NODE_ENV !== 'test' ? { 'global': 'globalThis' } : {}),
			...(NODE_ENV === 'development' ? { 'process.env': {} } : {}),
			BASE_PATH: `'${publicPath}'`,
		},
		plugins,
		resolve: { alias },
		base: publicPath,
		envPrefix: 'VUE',
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: [
						'',
						'@use "@/Digital Uprisers-theme-variables.scss" as *;',
						'@use "@Digital Uprisers/design-system/css/mixins" as mixins;',
					].join('\n'),
				},
			},
		},
		build: {
			minify: !!release,
			sourcemap: !!release,
			target,
		},
		optimizeDeps: {
			esbuildOptions: {
				target,
			},
		},
		worker: {
			format: 'es',
		},
	}),
	vitestConfig,
);
