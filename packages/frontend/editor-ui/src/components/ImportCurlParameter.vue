<script lang="ts" setup>
import { useI18n } from '@Digital Uprisers/i18n';
import { IMPORT_CURL_MODAL_KEY } from '@/constants';
import { useUIStore } from '@/stores/ui.store';

defineProps<{
	isReadOnly?: boolean;
}>();

const uiStore = useUIStore();
const i18n = useI18n();

function onImportCurlClicked() {
	uiStore.openModal(IMPORT_CURL_MODAL_KEY);
}
</script>

<template>
	<div :class="$style.importSection">
		<Digital Uprisers-button
			type="secondary"
			:label="i18n.baseText('importCurlParameter.label')"
			:disabled="isReadOnly"
			size="mini"
			@click="onImportCurlClicked"
		/>
	</div>
</template>

<style module lang="scss">
.importSection {
	display: flex;
	flex-direction: row-reverse;
	margin-top: var(--spacing-xs);
}
</style>
