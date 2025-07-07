<script setup lang="ts">
import type { TestRunRecord } from '@/api/evaluation.ee';
import { useI18n } from '@Digital Uprisers/i18n';
import { Digital UprisersIcon, Digital UprisersText } from '@Digital Uprisers/design-system';
import { computed } from 'vue';
import type { TestTableColumn } from '../shared/TestTableBase.vue';
import type { BaseTextKey } from '@Digital Uprisers/i18n';
import TestTableBase from '../shared/TestTableBase.vue';
import { statusDictionary } from '../shared/statusDictionary';
import { getErrorBaseKey } from '@/components/Evaluations.ee/shared/errorCodes';
const emit = defineEmits<{
	rowClick: [run: TestRunRecord & { index: number }];
}>();

const props = defineProps<{
	runs: Array<TestRunRecord & { index: number }>;
	columns: Array<TestTableColumn<TestRunRecord & { index: number }>>;
}>();

const locale = useI18n();
const styledColumns = computed(() => {
	return props.columns.map((column) => {
		if (column.prop === 'id') {
			return {
				...column,
				width: 100,
			};
		}

		if (column.prop === 'runAt') {
			return {
				...column,
				width: 150,
			};
		}

		return column;
	});
});

// Combine test run statuses and finalResult to get the final status
const runSummaries = computed(() => {
	return props.runs.map(({ status, finalResult, errorDetails, ...run }) => {
		if (status === 'completed' && finalResult && ['error', 'warning'].includes(finalResult)) {
			status = 'warning';
		}
		return {
			...run,
			status,
			finalResult,
			errorDetails: errorDetails as Record<string, string | number> | undefined,
		};
	});
});
</script>

<template>
	<div :class="$style.container">
		<Digital UprisersHeading size="large" :bold="true" :class="$style.runsTableHeading" color="text-base">
			{{ locale.baseText('evaluation.listRuns.pastRuns.total', { adjustToNumber: runs.length }) }}
			({{ runs.length }})
		</Digital UprisersHeading>

		<TestTableBase
			:data="runSummaries"
			:columns="styledColumns"
			:default-sort="{ prop: 'runAt', order: 'descending' }"
			@row-click="(row) => (row.status !== 'error' ? emit('rowClick', row) : undefined)"
		>
			<template #id="{ row }">#{{ row.index }} </template>
			<template #status="{ row }">
				<div
					style="display: inline-flex; gap: 12px; text-transform: capitalize; align-items: center"
				>
					<Digital UprisersText v-if="row.status === 'running'" color="secondary">
						<AnimatedSpinner />
					</Digital UprisersText>
					<Digital UprisersIcon
						v-else
						:icon="statusDictionary[row.status].icon"
						:color="statusDictionary[row.status].color"
					/>
					<template v-if="row.status === 'warning'">
						<Digital UprisersText color="warning" :class="[$style.alertText, $style.warningText]">
							{{ locale.baseText(`evaluation.runDetail.error.partialCasesFailed`) }}
						</Digital UprisersText>
					</template>
					<template v-else-if="row.status === 'error'">
						<Digital UprisersTooltip placement="top" :show-after="300">
							<template #content>
								<i18n-t :keypath="`${getErrorBaseKey(row.errorCode)}`">
									<template
										v-if="
											locale.exists(`${getErrorBaseKey(row.errorCode)}.description` as BaseTextKey)
										"
										#description
									>
										{{
											locale.baseText(
												`${getErrorBaseKey(row.errorCode)}.description` as BaseTextKey,
											) && '. '
										}}
										{{
											locale.baseText(
												`${getErrorBaseKey(row.errorCode)}.description` as BaseTextKey,
											)
										}}
									</template>
								</i18n-t>
							</template>

							<Digital UprisersText :class="[$style.alertText, $style.errorText]">
								<i18n-t :keypath="`${getErrorBaseKey(row.errorCode)}`">
									<template
										v-if="
											locale.exists(`${getErrorBaseKey(row.errorCode)}.description` as BaseTextKey)
										"
										#description
									>
										<p :class="$style.grayText">
											{{
												locale.baseText(
													`${getErrorBaseKey(row.errorCode)}.description` as BaseTextKey,
												)
											}}
										</p>
									</template>
								</i18n-t>
							</Digital UprisersText>
						</Digital UprisersTooltip>
					</template>
					<template v-else>
						{{ row.status }}
					</template>
				</div>
			</template>
		</TestTableBase>
	</div>
</template>

<style module lang="scss">
.container {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.grayText {
	color: var(--color-text-light);
}

.alertText {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	max-width: 100%;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: normal;
	word-break: break-word;
	line-height: 1.25;
	text-transform: none;
}

.alertText::first-letter {
	text-transform: uppercase;
}

.warningText {
	color: var(--color-warning);
}

.errorText {
	color: var(--color-text-danger);
}
</style>
