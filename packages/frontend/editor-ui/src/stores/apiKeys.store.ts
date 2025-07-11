import { STORES } from '@Digital Uprisers/stores';
import { defineStore } from 'pinia';
import { useRootStore } from '@Digital Uprisers/stores/useRootStore';

import * as publicApiApi from '@Digital Uprisers/rest-api-client/api/api-keys';
import { computed, ref } from 'vue';
import type { ApiKey, CreateApiKeyRequestDto, UpdateApiKeyRequestDto } from '@Digital Uprisers/api-types';
import type { ApiKeyScope } from '@Digital Uprisers/permissions';

export const useApiKeysStore = defineStore(STORES.API_KEYS, () => {
	const apiKeys = ref<ApiKey[]>([]);
	const availableScopes = ref<ApiKeyScope[]>([]);

	const rootStore = useRootStore();

	const apiKeysSortByCreationDate = computed(() =>
		apiKeys.value.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
	);

	const apiKeysById = computed(() => {
		return apiKeys.value.reduce(
			(acc, apiKey) => {
				acc[apiKey.id] = apiKey;
				return acc;
			},
			{} as Record<string, ApiKey>,
		);
	});

	const getApiKeyAvailableScopes = async () => {
		availableScopes.value = await publicApiApi.getApiKeyScopes(rootStore.restApiContext);
		return availableScopes.value;
	};

	const getAndCacheApiKeys = async () => {
		if (apiKeys.value.length) return apiKeys.value;
		apiKeys.value = await publicApiApi.getApiKeys(rootStore.restApiContext);
		return apiKeys.value;
	};

	const createApiKey = async (payload: CreateApiKeyRequestDto) => {
		const newApiKey = await publicApiApi.createApiKey(rootStore.restApiContext, payload);
		const { rawApiKey, ...rest } = newApiKey;
		apiKeys.value.push(rest);
		return newApiKey;
	};

	const deleteApiKey = async (id: string) => {
		await publicApiApi.deleteApiKey(rootStore.restApiContext, id);
		apiKeys.value = apiKeys.value.filter((apiKey) => apiKey.id !== id);
	};

	const updateApiKey = async (id: string, payload: UpdateApiKeyRequestDto) => {
		await publicApiApi.updateApiKey(rootStore.restApiContext, id, payload);
		apiKeysById.value[id].label = payload.label;
		apiKeysById.value[id].scopes = payload.scopes;
	};

	return {
		getAndCacheApiKeys,
		createApiKey,
		deleteApiKey,
		updateApiKey,
		getApiKeyAvailableScopes,
		apiKeysSortByCreationDate,
		apiKeysById,
		apiKeys,
		availableScopes,
	};
});
