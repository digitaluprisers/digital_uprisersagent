import './main.scss';

import { createApp } from 'vue';

import { defaultMountingTarget, defaultOptions } from '@Digital Uprisers/chat/constants';
import { ChatPlugin } from '@Digital Uprisers/chat/plugins';
import type { ChatOptions } from '@Digital Uprisers/chat/types';
import { createDefaultMountingTarget } from '@Digital Uprisers/chat/utils';

import App from './App.vue';

export function createChat(options?: Partial<ChatOptions>) {
	const resolvedOptions: ChatOptions = {
		...defaultOptions,
		...options,
		webhookConfig: {
			...defaultOptions.webhookConfig,
			...options?.webhookConfig,
		},
		i18n: {
			...defaultOptions.i18n,
			...options?.i18n,
			en: {
				...defaultOptions.i18n?.en,
				...options?.i18n?.en,
			},
		},
		theme: {
			...defaultOptions.theme,
			...options?.theme,
		},
	};

	const mountingTarget = resolvedOptions.target ?? defaultMountingTarget;
	if (typeof mountingTarget === 'string') {
		createDefaultMountingTarget(mountingTarget);
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const app = createApp(App);
	app.use(ChatPlugin, resolvedOptions);
	app.mount(mountingTarget);
	return app;
}
