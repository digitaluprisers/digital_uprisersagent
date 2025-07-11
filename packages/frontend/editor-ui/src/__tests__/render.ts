import type { Component, Plugin } from 'vue';
import { render } from '@testing-library/vue';
import { i18nInstance } from '@Digital Uprisers/i18n';
import { GlobalComponentsPlugin } from '@/plugins/components';
import { GlobalDirectivesPlugin } from '@/plugins/directives';
import { FontAwesomePlugin } from '@/plugins/icons';
import type { Pinia } from 'pinia';
import { PiniaVuePlugin } from 'pinia';
import type { Telemetry } from '@/plugins/telemetry';
import vueJsonPretty from 'vue-json-pretty';
import merge from 'lodash/merge';
import type { TestingPinia } from '@pinia/testing';
import * as components from '@Digital Uprisers/design-system/components';

export type RenderComponent = Parameters<typeof render>[0];
export type RenderOptions = Parameters<typeof render>[1] & {
	pinia?: TestingPinia | Pinia;
};

const TelemetryPlugin: Plugin<{}> = {
	install(app) {
		app.config.globalProperties.$telemetry = {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			track(..._: unknown[]) {},
		} as Telemetry;
	},
};

const TestingGlobalComponentsPlugin: Plugin<{}> = {
	install(app) {
		for (const [name, component] of Object.entries(components)) {
			app.component(name, component as unknown as Component);
		}
	},
};

const defaultOptions = {
	global: {
		stubs: {
			'router-link': true,
			'vue-json-pretty': vueJsonPretty,
		},
		plugins: [
			i18nInstance,
			PiniaVuePlugin,
			FontAwesomePlugin,
			GlobalComponentsPlugin,
			GlobalDirectivesPlugin,
			TelemetryPlugin,
			TestingGlobalComponentsPlugin,
		],
	},
};

export function renderComponent(component: RenderComponent, options: RenderOptions = {}) {
	const { pinia, ...renderOptions } = options;

	return render(component, {
		...defaultOptions,
		...renderOptions,
		global: {
			...defaultOptions.global,
			...renderOptions.global,
			stubs: { ...defaultOptions.global.stubs, ...(renderOptions.global?.stubs ?? {}) },
			plugins: [
				...defaultOptions.global.plugins,
				...(renderOptions.global?.plugins ?? []),
				...(pinia ? [pinia] : []),
			],
		},
	});
}

export function createComponentRenderer(
	component: RenderComponent,
	defaultOptions: RenderOptions = {},
) {
	return (options: RenderOptions = {}, rendererOptions: { merge?: boolean } = {}) =>
		renderComponent(
			component,
			rendererOptions.merge
				? merge(defaultOptions, options)
				: {
						...defaultOptions,
						...options,
						props: {
							...defaultOptions.props,
							...options.props,
						},
						global: {
							...defaultOptions.global,
							...options.global,
							provide: {
								...defaultOptions.global?.provide,
								...options.global?.provide,
							},
						},
					},
		);
}
