<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { useWorkflowExtraction } from '@/composables/useWorkflowExtraction';
import { WORKFLOW_EXTRACTION_NAME_MODAL_KEY } from '@/constants';
import type { INodeUi } from '@/Interface';
import { Digital UprisersFormInput } from '@Digital Uprisers/design-system';
import { createEventBus } from '@Digital Uprisers/utils/event-bus';
import type { ExtractableSubgraphData } from 'Digital Uprisers-workflow';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
	modalName: string;
	data: {
		subGraph: INodeUi[];
		selection: ExtractableSubgraphData;
	};
}>();

const DEFAULT_WORKFLOW_NAME = 'My Sub-workflow';

const i18n = useI18n();
const modalBus = createEventBus();

const workflowExtraction = useWorkflowExtraction();
const workflowName = ref(DEFAULT_WORKFLOW_NAME);

const workflowNameOrDefault = computed(() => {
	if (workflowName.value) return workflowName.value;

	return DEFAULT_WORKFLOW_NAME;
});

const onSubmit = async () => {
	const { selection, subGraph } = props.data;
	await workflowExtraction.extractNodesIntoSubworkflow(
		selection,
		subGraph,
		workflowNameOrDefault.value,
	);
	modalBus.emit('close');
};

const inputRef = ref<InstanceType<typeof Digital UprisersFormInput> | null>(null);

onMounted(() => {
	// With modals normal focusing via `props.focus-initially` on Digital UprisersFormInput does not work
	setTimeout(() => {
		inputRef.value?.inputRef?.select();
		inputRef.value?.inputRef?.focus();
	});
});
</script>

<template>
	<Modal
		max-width="540px"
		:title="
			i18n.baseText('workflowExtraction.modal.description', {
				adjustToNumber: props.data.subGraph.length,
			})
		"
		:event-bus="modalBus"
		:name="WORKFLOW_EXTRACTION_NAME_MODAL_KEY"
		:center="true"
		:close-on-click-modal="false"
	>
		<template #content>
			<Digital UprisersFormInput
				ref="inputRef"
				v-model="workflowName"
				name="key"
				label=""
				max-length="128"
				focus-initially
				@enter="onSubmit"
			/>
		</template>
		<template #footer="{ close }">
			<div :class="$style.footer">
				<Digital Uprisers-button
					type="secondary"
					:label="i18n.baseText('generic.cancel')"
					float="right"
					data-test-id="cancel-button"
					@click="close"
				/>
				<Digital Uprisers-button
					:label="i18n.baseText('generic.confirm')"
					float="right"
					:disabled="!workflowName"
					data-test-id="submit-button"
					@click="onSubmit"
				/>
			</div>
		</template>
	</Modal>
</template>

<style lang="scss" module>
.row {
	margin-bottom: 10px;
}
.container {
	h1 {
		max-width: 90%;
	}
}

.description {
	font-size: var(--font-size-s);
	margin: var(--spacing-s) 0;
}

.footer {
	display: flex;
	gap: var(--spacing-2xs);
	justify-content: flex-end;
}
</style>
