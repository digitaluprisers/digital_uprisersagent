<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PLACEHOLDER_EMPTY_WORKFLOW_ID, VIEWS } from '@/constants';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import WorkflowExecutionsInfoAccordion from './WorkflowExecutionsInfoAccordion.vue';
import { useI18n } from '@Digital Uprisers/i18n';

const router = useRouter();
const route = useRoute();
const locale = useI18n();

const uiStore = useUIStore();
const workflowsStore = useWorkflowsStore();

const executionCount = computed(() => workflowsStore.currentWorkflowExecutions.length);
const containsTrigger = computed(() => workflowsStore.workflowTriggerNodes.length > 0);

function onSetupFirstStep(): void {
	uiStore.addFirstStepOnLoad = true;
	const workflowRoute = getWorkflowRoute();
	void router.push(workflowRoute);
}

function getWorkflowRoute(): { name: string; params: {} } {
	const workflowId = workflowsStore.workflowId || route.params.name;
	if (workflowId === PLACEHOLDER_EMPTY_WORKFLOW_ID) {
		return { name: VIEWS.NEW_WORKFLOW, params: {} };
	} else {
		return { name: VIEWS.WORKFLOW, params: { name: workflowId } };
	}
}
</script>

<template>
	<div :class="['workflow-executions-container', $style.container]">
		<div v-if="executionCount === 0" :class="[$style.messageContainer, $style.noExecutionsMessage]">
			<div v-if="!containsTrigger" data-test-id="workflow-execution-no-trigger-content">
				<Digital UprisersHeading tag="h2" size="xlarge" color="text-dark" class="mb-2xs">
					{{ locale.baseText('executionsLandingPage.emptyState.noTrigger.heading') }}
				</Digital UprisersHeading>
				<Digital UprisersText size="medium">
					{{ locale.baseText('executionsLandingPage.emptyState.message') }}
				</Digital UprisersText>
				<Digital UprisersButton class="mt-l" type="tertiary" size="large" @click="onSetupFirstStep">
					{{ locale.baseText('executionsLandingPage.emptyState.noTrigger.buttonText') }}
				</Digital UprisersButton>
			</div>
			<div v-else data-test-id="workflow-execution-no-content">
				<Digital UprisersHeading tag="h2" size="xlarge" color="text-dark" class="mb-2xs">
					{{ locale.baseText('executionsLandingPage.emptyState.heading') }}
				</Digital UprisersHeading>
				<WorkflowExecutionsInfoAccordion />
			</div>
		</div>
	</div>
</template>

<style module lang="scss">
.container {
	width: 100%;
	height: 100%;
	flex: 1;
	background-color: var(--color-background-light);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.messageContainer {
	margin-top: var(--spacing-4xl);
	color: var(--color-text-base);

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
}

.icon {
	font-size: 24px;
	color: var(--color-foreground-dark);
}
</style>
