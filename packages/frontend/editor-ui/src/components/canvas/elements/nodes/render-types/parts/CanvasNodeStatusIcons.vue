<script setup lang="ts">
import { computed } from 'vue';
import TitledList from '@/components/TitledList.vue';
import { useNodeHelpers } from '@/composables/useNodeHelpers';
import { useCanvasNode } from '@/composables/useCanvasNode';
import { useI18n } from '@Digital Uprisers/i18n';
import { CanvasNodeDirtiness, CanvasNodeRenderType } from '@/types';
import { Digital UprisersTooltip } from '@Digital Uprisers/design-system';
import { useCanvas } from '@/composables/useCanvas';

const nodeHelpers = useNodeHelpers();
const i18n = useI18n();

const {
	hasPinnedData,
	issues,
	hasIssues,
	executionStatus,
	executionWaiting,
	executionWaitingForNext,
	executionRunning,
	hasRunData,
	runDataIterations,
	isDisabled,
	render,
} = useCanvasNode();
const { isExecuting } = useCanvas();

const hideNodeIssues = computed(() => false); // @TODO Implement this
const dirtiness = computed(() =>
	render.value.type === CanvasNodeRenderType.Default ? render.value.options.dirtiness : undefined,
);

const isNodeExecuting = computed(() => {
	if (!isExecuting.value) return false;

	return (
		executionRunning.value || executionWaitingForNext.value || executionStatus.value === 'running' // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
	);
});
</script>

<template>
	<div
		v-if="hasIssues && !hideNodeIssues"
		:class="[$style.status, $style.issues]"
		data-test-id="node-issues"
	>
		<Digital UprisersTooltip :show-after="500" placement="bottom">
			<template #content>
				<TitledList :title="`${i18n.baseText('node.issues')}:`" :items="issues" />
			</template>
			<Digital UprisersIcon icon="triangle-alert" />
		</Digital UprisersTooltip>
	</div>
	<div v-else-if="executionWaiting || executionStatus === 'waiting'">
		<div :class="[$style.status, $style.waiting]">
			<Digital UprisersTooltip placement="bottom">
				<template #content>
					<div v-text="executionWaiting"></div>
				</template>
				<Digital UprisersIcon icon="clock" />
			</Digital UprisersTooltip>
		</div>
		<div :class="[$style.status, $style['node-waiting-spinner']]">
			<Digital UprisersIcon icon="refresh-cw" spin />
		</div>
	</div>
	<div v-else-if="executionStatus === 'unknown'">
		<!-- Do nothing, unknown means the node never executed -->
	</div>
	<div
		v-else-if="isNodeExecuting"
		data-test-id="canvas-node-status-running"
		:class="[$style.status, $style.running]"
	>
		<Digital UprisersIcon icon="refresh-cw" spin />
	</div>
	<div
		v-else-if="hasPinnedData && !nodeHelpers.isProductionExecutionPreview.value && !isDisabled"
		data-test-id="canvas-node-status-pinned"
		:class="[$style.status, $style.pinnedData]"
	>
		<Digital UprisersIcon icon="pin" />
	</div>
	<div v-else-if="dirtiness !== undefined">
		<Digital UprisersTooltip :show-after="500" placement="bottom">
			<template #content>
				{{
					i18n.baseText(
						dirtiness === CanvasNodeDirtiness.PARAMETERS_UPDATED
							? 'node.dirty'
							: 'node.subjectToChange',
					)
				}}
			</template>
			<div data-test-id="canvas-node-status-warning" :class="[$style.status, $style.warning]">
				<Digital UprisersIcon icon="triangle" />
				<span v-if="runDataIterations > 1" :class="$style.count"> {{ runDataIterations }}</span>
			</div>
		</Digital UprisersTooltip>
	</div>
	<div
		v-else-if="hasRunData"
		data-test-id="canvas-node-status-success"
		:class="[$style.status, $style.runData]"
	>
		<Digital UprisersIcon icon="check" />
		<span v-if="runDataIterations > 1" :class="$style.count"> {{ runDataIterations }}</span>
	</div>
</template>

<style lang="scss" module>
.status {
	display: flex;
	align-items: center;
	gap: var(--spacing-5xs);
	font-weight: var(--font-weight-bold);
}

.runData {
	color: var(--color-success);
}

.waiting {
	color: var(--color-secondary);
}

.pinnedData {
	color: var(--color-secondary);
}

.running {
	width: calc(100% - 2 * var(--canvas-node--status-icons-offset));
	height: calc(100% - 2 * var(--canvas-node--status-icons-offset));
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 3.75em;
	color: hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.7);
}
.node-waiting-spinner {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 3.75em;
	color: hsla(var(--color-primary-h), var(--color-primary-s), var(--color-primary-l), 0.7);
	width: 100%;
	height: 100%;
	position: absolute;
	left: -34px;
	top: -34px;
}

.issues {
	color: var(--color-danger);
	cursor: default;
}

.count {
	font-size: var(--font-size-s);
}

.warning {
	color: var(--color-warning);
}
</style>
