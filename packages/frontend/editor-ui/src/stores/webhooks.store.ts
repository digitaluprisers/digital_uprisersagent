import { STORES } from '@Digital Uprisers/stores';
import { defineStore } from 'pinia';
import { useRootStore } from '@Digital Uprisers/stores/useRootStore';
import { useNDVStore } from './ndv.store';
import { useUIStore } from './ui.store';
import { useUsersStore } from './users.store';
import { useWorkflowsStore } from './workflows.store';
import { useSettingsStore } from './settings.store';

export const useWebhooksStore = defineStore(STORES.WEBHOOKS, () => {
	return {
		...useRootStore(),
		...useWorkflowsStore(),
		...useUIStore(),
		...useUsersStore(),
		...useNDVStore(),
		...useSettingsStore(),
	};
});
