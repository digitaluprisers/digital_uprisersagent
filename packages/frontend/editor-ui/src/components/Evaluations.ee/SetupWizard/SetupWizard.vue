<script setup lang="ts">
import { useI18n } from '@Digital Uprisers/i18n';
import { Digital UprisersText, Digital UprisersButton, Digital UprisersCallout } from '@Digital Uprisers/design-system';
import { ref, computed } from 'vue';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useEvaluationStore } from '@/stores/evaluation.store.ee';
import { PLACEHOLDER_EMPTY_WORKFLOW_ID, VIEWS } from '@/constants';
import StepHeader from '../shared/StepHeader.vue';
import { useRouter } from 'vue-router';
import { useUsageStore } from '@/stores/usage.store';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';

defineEmits<{
	runTest: [];
}>();

const router = useRouter();
const locale = useI18n();
const workflowsStore = useWorkflowsStore();
const evaluationStore = useEvaluationStore();
const usageStore = useUsageStore();
const pageRedirectionHelper = usePageRedirectionHelper();

const hasRuns = computed(() => {
	return evaluationStore.testRunsByWorkflowId[workflowsStore.workflow.id]?.length > 0;
});

const evaluationsAvailable = computed(() => {
	return (
		usageStore.workflowsWithEvaluationsLimit === -1 ||
		usageStore.workflowsWithEvaluationsCount < usageStore.workflowsWithEvaluationsLimit
	);
});

const evaluationsQuotaExceeded = computed(() => {
	return (
		usageStore.workflowsWithEvaluationsLimit !== -1 &&
		usageStore.workflowsWithEvaluationsCount >= usageStore.workflowsWithEvaluationsLimit &&
		!hasRuns.value
	);
});

const activeStepIndex = ref(0);

// Calculate the initial active step based on the workflow state
const initializeActiveStep = () => {
	if (evaluationsQuotaExceeded.value) {
		activeStepIndex.value = 2;
		return;
	}

	if (evaluationStore.evaluationTriggerExists && evaluationStore.evaluationSetMetricsNodeExist) {
		activeStepIndex.value = 3;
	} else if (
		evaluationStore.evaluationTriggerExists &&
		evaluationStore.evaluationSetOutputsNodeExist
	) {
		activeStepIndex.value = 2;
	} else if (evaluationStore.evaluationTriggerExists) {
		activeStepIndex.value = 1;
	} else {
		activeStepIndex.value = 0;
	}
};

// Run initialization on component mount
initializeActiveStep();

const toggleStep = (index: number) => {
	activeStepIndex.value = index;
};

function navigateToWorkflow(
	action?: 'addEvaluationTrigger' | 'addEvaluationNode' | 'executeEvaluation',
) {
	const routeWorkflowId =
		workflowsStore.workflow.id === PLACEHOLDER_EMPTY_WORKFLOW_ID
			? 'new'
			: workflowsStore.workflow.id;

	void router.push({
		name: VIEWS.WORKFLOW,
		params: { name: routeWorkflowId },
		query: action ? { action } : undefined,
	});
}

function onSeePlans() {
	void pageRedirectionHelper.goToUpgrade('evaluations', 'upgrade-evaluations');
}
</script>

<template>
	<div :class="$style.container" data-test-id="evaluation-setup-wizard">
		<div :class="$style.steps">
			<!-- Step 1 -->
			<div :class="[$style.step, $style.completed]">
				<StepHeader
					:step-number="1"
					:title="locale.baseText('evaluations.setupWizard.step1.title')"
					:is-completed="evaluationStore.evaluationTriggerExists"
					:is-active="activeStepIndex === 0"
					@click="toggleStep(0)"
				/>
				<div v-if="activeStepIndex === 0" :class="$style.stepContent">
					<ul :class="$style.bulletPoints">
						<li>
							<Digital UprisersText size="small" color="text-base">
								{{ locale.baseText('evaluations.setupWizard.step1.item1') }}
							</Digital UprisersText>
						</li>
						<li>
							<Digital UprisersText size="small" color="text-base">
								{{ locale.baseText('evaluations.setupWizard.step1.item2') }}
							</Digital UprisersText>
						</li>
					</ul>

					<div :class="$style.actionButton">
						<Digital UprisersButton
							size="small"
							type="secondary"
							@click="navigateToWorkflow('addEvaluationTrigger')"
						>
							{{ locale.baseText('evaluations.setupWizard.step1.button') }}
						</Digital UprisersButton>
					</div>
				</div>
			</div>

			<!-- Step 2 -->
			<div :class="[$style.step, activeStepIndex === 1 ? $style.active : '']">
				<StepHeader
					:step-number="2"
					:title="locale.baseText('evaluations.setupWizard.step2.title')"
					:is-completed="evaluationStore.evaluationSetOutputsNodeExist"
					:is-active="activeStepIndex === 1"
					@click="toggleStep(1)"
				/>
				<div v-if="activeStepIndex === 1" :class="$style.stepContent">
					<ul :class="$style.bulletPoints">
						<li>
							<Digital UprisersText size="small" color="text-base">
								{{ locale.baseText('evaluations.setupWizard.step2.item1') }}
							</Digital UprisersText>
						</li>
					</ul>
					<div :class="$style.actionButton">
						<Digital UprisersButton
							size="small"
							type="secondary"
							@click="navigateToWorkflow('addEvaluationNode')"
						>
							{{ locale.baseText('evaluations.setupWizard.step2.button') }}
						</Digital UprisersButton>
					</div>
				</div>
			</div>

			<!-- Step 3 -->
			<div :class="$style.step">
				<StepHeader
					:step-number="3"
					:title="locale.baseText('evaluations.setupWizard.step3.title')"
					:is-completed="evaluationStore.evaluationSetMetricsNodeExist"
					:is-active="activeStepIndex === 2"
					:is-optional="true"
					@click="toggleStep(2)"
				/>
				<div v-if="activeStepIndex === 2" :class="$style.stepContent">
					<ul v-if="!evaluationsQuotaExceeded" :class="$style.bulletPoints">
						<li>
							<Digital UprisersText size="small" color="text-base">
								{{ locale.baseText('evaluations.setupWizard.step3.item1') }}
							</Digital UprisersText>
						</li>
						<li>
							<Digital UprisersText size="small" color="text-base">
								{{ locale.baseText('evaluations.setupWizard.step3.item2') }}
							</Digital UprisersText>
						</li>
					</ul>
					<Digital UprisersCallout v-else theme="warning" iconless>
						{{ locale.baseText('evaluations.setupWizard.limitReached') }}
					</Digital UprisersCallout>
					<div :class="$style.actionButton">
						<Digital UprisersButton
							v-if="!evaluationsQuotaExceeded"
							size="small"
							type="secondary"
							@click="navigateToWorkflow('addEvaluationNode')"
						>
							{{ locale.baseText('evaluations.setupWizard.step3.button') }}
						</Digital UprisersButton>
						<Digital UprisersButton v-else size="small" @click="onSeePlans">
							{{ locale.baseText('generic.seePlans') }}
						</Digital UprisersButton>
						<Digital UprisersButton
							size="small"
							text
							style="color: var(--color-text-light)"
							@click="toggleStep(3)"
						>
							{{ locale.baseText('evaluations.setupWizard.step3.skip') }}
						</Digital UprisersButton>
					</div>
					<div
						v-if="usageStore.workflowsWithEvaluationsLimit !== -1 && evaluationsAvailable"
						:class="$style.quotaNote"
					>
						<Digital UprisersText size="xsmall" color="text-base">
							<i18n-t keypath="evaluations.setupWizard.step3.notice">
								<template #link>
									<a style="text-decoration: underline; color: inherit" @click="onSeePlans"
										>{{ locale.baseText('evaluations.setupWizard.step3.notice.link') }}
									</a>
								</template>
							</i18n-t>
						</Digital UprisersText>
					</div>
				</div>
			</div>

			<!-- Step 4 -->
			<div :class="$style.step">
				<StepHeader
					:step-number="4"
					:title="locale.baseText('evaluations.setupWizard.step4.title')"
					:is-completed="false"
					:is-active="activeStepIndex === 3"
					@click="toggleStep(3)"
				>
					<div :class="[$style.actionButton, $style.actionButtonInline]">
						<Digital UprisersButton
							v-if="evaluationStore.evaluationSetMetricsNodeExist && !evaluationsQuotaExceeded"
							size="medium"
							type="secondary"
							:disabled="
								!evaluationStore.evaluationTriggerExists ||
								(!evaluationStore.evaluationSetOutputsNodeExist &&
									!evaluationStore.evaluationSetMetricsNodeExist)
							"
							@click="$emit('runTest')"
						>
							{{ locale.baseText('evaluations.setupWizard.step4.button') }}
						</Digital UprisersButton>
						<Digital UprisersButton
							v-else
							size="medium"
							type="secondary"
							:disabled="
								!evaluationStore.evaluationTriggerExists ||
								(!evaluationStore.evaluationSetOutputsNodeExist &&
									!evaluationStore.evaluationSetMetricsNodeExist)
							"
							@click="navigateToWorkflow('executeEvaluation')"
						>
							{{ locale.baseText('evaluations.setupWizard.step4.altButton') }}
						</Digital UprisersButton>
					</div>
				</StepHeader>
			</div>
		</div>
	</div>
</template>

<style module lang="scss">
.container {
	background-color: var(--color-background-light);
}

.steps {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-m);
}

.step {
	overflow: hidden;
}

.stepContent {
	padding: 0 0 0 calc(var(--spacing-xs) + 28px);
	animation: slideDown 0.2s ease;
}

.bulletPoints {
	padding-left: var(--spacing-s);

	li {
		margin-bottom: var(--spacing-3xs);
	}
}

.actionButton {
	margin-top: var(--spacing-s);
	display: flex;
	gap: var(--spacing-s);

	button {
		font-weight: var(--font-weight-bold);
	}
}

.actionButtonInline {
	margin: 0;
}

.quotaNote {
	margin-top: var(--spacing-2xs);
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
