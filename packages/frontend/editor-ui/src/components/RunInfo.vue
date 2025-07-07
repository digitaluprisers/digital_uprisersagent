<script setup lang="ts">
import type { ITaskData } from 'Digital Uprisers-workflow';
import { convertToDisplayDateComponents } from '@/utils/formatters/dateFormatter';
import { computed } from 'vue';
import { useI18n } from '@Digital Uprisers/i18n';
import { Digital UprisersInfoTip } from '@Digital Uprisers/design-system';

const i18n = useI18n();

const props = defineProps<{
	taskData: ITaskData | null;
	hasStaleData?: boolean;
	hasPinData?: boolean;
}>();

const runTaskData = computed(() => {
	return props.taskData;
});

const theme = computed(() => {
	return props.taskData?.error ? 'danger' : 'success';
});

const runMetadata = computed(() => {
	if (!runTaskData.value) {
		return null;
	}
	const { date, time } = convertToDisplayDateComponents(runTaskData.value.startTime);
	return {
		executionTime: runTaskData.value.executionTime,
		startTime: `${date} at ${time}`,
	};
});
</script>

<template>
	<Digital UprisersInfoTip
		v-if="hasStaleData"
		theme="warning-light"
		type="tooltip"
		tooltip-placement="right"
		data-test-id="node-run-info-stale"
	>
		<span
			v-Digital Uprisers-html="
				i18n.baseText(
					hasPinData
						? 'ndv.output.staleDataWarning.pinData'
						: 'ndv.output.staleDataWarning.regular',
				)
			"
		></span>
	</Digital UprisersInfoTip>
	<div v-else-if="runMetadata" :class="$style.tooltipRow">
		<Digital UprisersInfoTip
			type="note"
			:theme="theme"
			:data-test-id="`node-run-status-${theme}`"
			size="large"
		/>
		<Digital UprisersInfoTip
			type="tooltip"
			theme="info"
			:data-test-id="`node-run-info`"
			tooltip-placement="right"
		>
			<div>
				<Digital Uprisers-text :bold="true" size="small"
					>{{
						runTaskData?.error
							? i18n.baseText('runData.executionStatus.failed')
							: i18n.baseText('runData.executionStatus.success')
					}} </Digital Uprisers-text
				><br />
				<Digital Uprisers-text :bold="true" size="small">{{
					i18n.baseText('runData.startTime') + ':'
				}}</Digital Uprisers-text>
				{{ runMetadata.startTime }}<br />
				<Digital Uprisers-text :bold="true" size="small">{{
					i18n.baseText('runData.executionTime') + ':'
				}}</Digital Uprisers-text>
				{{ runMetadata.executionTime }} {{ i18n.baseText('runData.ms') }}
			</div>
		</Digital UprisersInfoTip>
	</div>
</template>

<style lang="scss" module>
.tooltipRow {
	display: flex;
	column-gap: var(--spacing-4xs);
}
</style>
