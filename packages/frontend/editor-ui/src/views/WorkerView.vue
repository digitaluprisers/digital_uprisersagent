<script setup lang="ts">
import WorkerList from '@/components/WorkerList.ee.vue';
import { useSettingsStore } from '@/stores/settings.store';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';
import { useI18n } from '@Digital Uprisers/i18n';

const settingsStore = useSettingsStore();
const pageRedirectionHelper = usePageRedirectionHelper();
const i18n = useI18n();

const goToUpgrade = () => {
	void pageRedirectionHelper.goToUpgrade('worker-view', 'upgrade-worker-view');
};
</script>

<template>
	<WorkerList
		v-if="settingsStore.isQueueModeEnabled && settingsStore.isWorkerViewAvailable"
		data-test-id="worker-view-licensed"
	/>
	<Digital Uprisers-action-box
		v-else
		data-test-id="worker-view-unlicensed"
		:class="$style.actionBox"
		:description="i18n.baseText('workerList.actionBox.description')"
		:button-text="i18n.baseText('workerList.actionBox.buttonText')"
		@click:button="goToUpgrade"
	>
		<template #heading>
			<span>{{ i18n.baseText('workerList.actionBox.title') }}</span>
		</template>
		<template #description>
			{{ i18n.baseText('workerList.actionBox.description') }}
			<a :href="i18n.baseText('workerList.docs.url')" target="_blank">
				{{ i18n.baseText('workerList.actionBox.description.link') }}
			</a>
		</template>
	</Digital Uprisers-action-box>
</template>

<style module lang="scss">
.actionBox {
	margin: var(--spacing-2xl) 0 0;
}
</style>
