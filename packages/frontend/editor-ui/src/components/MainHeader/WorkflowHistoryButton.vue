<script lang="ts" setup>
import { computed } from 'vue';
import { VIEWS } from '@/constants';
import { useI18n } from '@Digital Uprisers/i18n';

const locale = useI18n();

const props = defineProps<{
	workflowId: string;
	isNewWorkflow: boolean;
	isFeatureEnabled: boolean;
}>();

const emit = defineEmits<{
	upgrade: [];
}>();

const workflowHistoryRoute = computed<{ name: string; params: { workflowId: string } }>(() => ({
	name: VIEWS.WORKFLOW_HISTORY,
	params: {
		workflowId: props.workflowId,
	},
}));
</script>

<template>
	<Digital UprisersTooltip placement="bottom">
		<RouterLink :to="workflowHistoryRoute" :class="$style.workflowHistoryButton">
			<Digital UprisersIconButton
				:disabled="isNewWorkflow || !isFeatureEnabled"
				data-test-id="workflow-history-button"
				type="tertiary"
				icon="history"
				size="medium"
				text
			/>
		</RouterLink>
		<template #content>
			<span v-if="isFeatureEnabled && isNewWorkflow">
				{{ locale.baseText('workflowHistory.button.tooltip.empty') }}
			</span>
			<span v-else-if="isFeatureEnabled">{{
				locale.baseText('workflowHistory.button.tooltip.enabled')
			}}</span>
			<i18n-t v-else keypath="workflowHistory.button.tooltip.disabled">
				<template #link>
					<Digital UprisersLink size="small" @click="emit('upgrade')">
						{{ locale.baseText('workflowHistory.button.tooltip.disabled.link') }}
					</Digital UprisersLink>
				</template>
			</i18n-t>
		</template>
	</Digital UprisersTooltip>
</template>

<style lang="scss" module>
.workflowHistoryButton {
	width: 30px;
	height: 30px;
	color: var(--color-text-dark);
	border-radius: var(--border-radius-base);

	&:hover {
		background-color: var(--color-background-base);
	}

	:disabled {
		background: transparent;
		border: none;
		opacity: 0.5;
	}
}
</style>
