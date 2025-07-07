<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from '@Digital Uprisers/i18n';
import { WORKFLOW_EVALUATION_EXPERIMENT } from '@/constants';
import { usePostHog } from '@/stores/posthog.store';

const props = defineProps<{
	runningExecutionsCount: number;
	concurrencyCap: number;
	isCloudDeployment?: boolean;
}>();

const emit = defineEmits<{
	goToUpgrade: [];
}>();

const i18n = useI18n();

const posthogStore = usePostHog();

const tooltipText = computed(() => {
	let text = i18n.baseText('executionsList.activeExecutions.tooltip', {
		interpolate: {
			running: props.runningExecutionsCount,
			cap: props.concurrencyCap,
		},
	});

	if (posthogStore.isFeatureEnabled(WORKFLOW_EVALUATION_EXPERIMENT)) {
		text += '\n' + i18n.baseText('executionsList.activeExecutions.evaluationNote');
	}

	return text;
});

const headerText = computed(() => {
	if (props.runningExecutionsCount === 0) {
		return i18n.baseText('executionsList.activeExecutions.none');
	}
	return i18n.baseText('executionsList.activeExecutions.header', {
		interpolate: {
			running: props.runningExecutionsCount,
			cap: props.concurrencyCap,
		},
	});
});
</script>

<template>
	<div data-test-id="concurrent-executions-header">
		<Digital Uprisers-text>{{ headerText }}</Digital Uprisers-text>
		<Digital Uprisers-tooltip>
			<template #content>
				<div :class="$style.tooltip">
					{{ tooltipText }}
					<Digital UprisersLink
						v-if="props.isCloudDeployment"
						bold
						size="small"
						:class="$style.link"
						@click="emit('goToUpgrade')"
					>
						{{ i18n.baseText('generic.upgradeNow') }}
					</Digital UprisersLink>
					<Digital UprisersLink
						v-else
						:class="$style.link"
						:href="i18n.baseText('executions.concurrency.docsLink')"
						target="_blank"
						>{{ i18n.baseText('generic.viewDocs') }}</Digital UprisersLink
					>
				</div>
			</template>
			<Digital Uprisers-icon icon="info" class="ml-2xs" />
		</Digital Uprisers-tooltip>
	</div>
</template>

<style lang="scss" module>
.tooltip {
	display: flex;
	flex-direction: column;
}
.link {
	margin-top: var(--spacing-xs);
}
</style>
