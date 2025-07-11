<script setup lang="ts">
import { computed } from 'vue';
import type { IBinaryData, IRunData } from 'Digital Uprisers-workflow';
import BinaryDataDisplayEmbed from '@/components/BinaryDataDisplayEmbed.vue';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useNodeHelpers } from '@/composables/useNodeHelpers';
import { useI18n } from '@Digital Uprisers/i18n';

const props = defineProps<{
	displayData: IBinaryData;
	windowVisible: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const nodeHelpers = useNodeHelpers();
const workflowsStore = useWorkflowsStore();

const i18n = useI18n();

const workflowRunData = computed<IRunData | null>(() => {
	const workflowExecution = workflowsStore.getWorkflowExecution;
	if (workflowExecution === null) {
		return null;
	}
	const executionData = workflowExecution.data;
	return executionData ? executionData.resultData.runData : null;
});

const binaryData = computed<IBinaryData | null>(() => {
	if (
		typeof props.displayData.node !== 'string' ||
		typeof props.displayData.key !== 'string' ||
		typeof props.displayData.runIndex !== 'number' ||
		typeof props.displayData.index !== 'number' ||
		typeof props.displayData.outputIndex !== 'number'
	) {
		return null;
	}

	const binaryDataLocal = nodeHelpers.getBinaryData(
		workflowRunData.value,
		props.displayData.node,
		props.displayData.runIndex,
		props.displayData.outputIndex,
	);

	if (binaryDataLocal.length === 0) {
		return null;
	}

	if (
		props.displayData.index >= binaryDataLocal.length ||
		binaryDataLocal[props.displayData.index][props.displayData.key] === undefined
	) {
		return null;
	}

	const binaryDataItem: IBinaryData =
		binaryDataLocal[props.displayData.index][props.displayData.key];

	return binaryDataItem;
});

function closeWindow() {
	// Handle the close externally as the visible parameter is an external prop
	// and is so not allowed to be changed here.
	emit('close');
	return false;
}
</script>

<template>
	<div v-if="windowVisible" :class="['binary-data-window', binaryData?.fileType]">
		<Digital Uprisers-button
			size="small"
			class="binary-data-window-back"
			:title="i18n.baseText('binaryDataDisplay.backToOverviewPage')"
			icon="arrow-left"
			:label="i18n.baseText('binaryDataDisplay.backToList')"
			@click.stop="closeWindow"
		/>

		<div class="binary-data-window-wrapper">
			<div v-if="!binaryData">
				{{ i18n.baseText('binaryDataDisplay.noDataFoundToDisplay') }}
			</div>
			<BinaryDataDisplayEmbed v-else :binary-data="binaryData" />
		</div>
	</div>
</template>

<style lang="scss">
.binary-data-window {
	position: absolute;
	top: 50px;
	left: 0;
	z-index: 10;
	width: 100%;
	height: calc(100% - 50px);
	background-color: var(--color-run-data-background);
	overflow: hidden;
	text-align: center;

	&.json {
		overflow: auto;
	}

	.binary-data-window-wrapper {
		margin-top: 0.5em;
		padding: 0 1em;
		height: calc(100% - 50px);

		.el-row,
		.el-col {
			height: 100%;
		}
	}
}
</style>
