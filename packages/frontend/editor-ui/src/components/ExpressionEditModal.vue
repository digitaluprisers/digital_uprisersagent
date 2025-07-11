<script setup lang="ts">
import ExpressionEditorModalInput from '@/components/ExpressionEditorModal/ExpressionEditorModalInput.vue';
import { computed, ref, toRaw, watch } from 'vue';
import Close from 'virtual:icons/mdi/close';

import { useExternalHooks } from '@/composables/useExternalHooks';
import { useNDVStore } from '@/stores/ndv.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { createExpressionTelemetryPayload } from '@/utils/telemetryUtils';

import { useTelemetry } from '@/composables/useTelemetry';
import type { Segment } from '@/types/expressions';
import type { INodeProperties } from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';
import { outputTheme } from './ExpressionEditorModal/theme';
import ExpressionOutput from './InlineExpressionEditor/ExpressionOutput.vue';
import VirtualSchema from '@/components/VirtualSchema.vue';
import OutputItemSelect from './InlineExpressionEditor/OutputItemSelect.vue';
import { useI18n } from '@Digital Uprisers/i18n';
import { useDebounce } from '@/composables/useDebounce';
import DraggableTarget from './DraggableTarget.vue';
import { dropInExpressionEditor } from '@/plugins/codemirror/dragAndDrop';

import { APP_MODALS_ELEMENT_ID } from '@/constants';
import { Digital UprisersInput, Digital UprisersText } from '@Digital Uprisers/design-system';
import { Digital UprisersResizeWrapper, type ResizeData } from '@Digital Uprisers/design-system';
import { useThrottleFn } from '@vueuse/core';

const DEFAULT_LEFT_SIDEBAR_WIDTH = 360;

type Props = {
	parameter: INodeProperties;
	path: string;
	modelValue: string;
	dialogVisible?: boolean;
	eventSource?: string;
	redactValues?: boolean;
	isReadOnly?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	eventSource: '',
	dialogVisible: false,
	redactValues: false,
	isReadOnly: false,
});
const emit = defineEmits<{
	'update:model-value': [value: string];
	closeDialog: [];
}>();

const ndvStore = useNDVStore();
const workflowsStore = useWorkflowsStore();

const telemetry = useTelemetry();
const i18n = useI18n();
const externalHooks = useExternalHooks();
const { debounce } = useDebounce();

const segments = ref<Segment[]>([]);
const search = ref('');
const appliedSearch = ref('');
const sidebarWidth = ref(DEFAULT_LEFT_SIDEBAR_WIDTH);
const expressionInputRef = ref<InstanceType<typeof ExpressionEditorModalInput>>();
const expressionResultRef = ref<InstanceType<typeof ExpressionOutput>>();
const theme = outputTheme();

const activeNode = computed(() => ndvStore.activeNode);
const workflow = computed(() => workflowsStore.getCurrentWorkflow());
const inputEditor = computed(() => expressionInputRef.value?.editor);
const parentNodes = computed(() => {
	const node = activeNode.value;
	if (!node) return [];
	const nodes = workflow.value.getParentNodesByDepth(node.name);

	return nodes.filter(({ name }) => name !== node.name);
});

watch(
	() => props.dialogVisible,
	(newValue) => {
		const resolvedExpressionValue = expressionResultRef.value?.getValue() ?? '';

		void externalHooks.run('expressionEdit.dialogVisibleChanged', {
			dialogVisible: newValue,
			parameter: props.parameter,
			value: props.modelValue.toString(),
			resolvedExpressionValue,
		});

		if (!newValue) {
			const telemetryPayload = createExpressionTelemetryPayload(
				segments.value,
				props.modelValue.toString(),
				workflowsStore.workflowId,
				ndvStore.pushRef,
				ndvStore.activeNode?.type ?? '',
			);

			telemetry.track('User closed Expression Editor', telemetryPayload);
			void externalHooks.run('expressionEdit.closeDialog', telemetryPayload);
		}
	},
);

watch(
	search,
	debounce(
		(newSearch: string) => {
			appliedSearch.value = newSearch;
		},
		{ debounceTime: 500 },
	),
);

function valueChanged(update: { value: string; segments: Segment[] }) {
	segments.value = update.segments;
	emit('update:model-value', update.value);
}

function closeDialog() {
	emit('closeDialog');
}

async function onDrop(expression: string, event: MouseEvent) {
	if (!inputEditor.value) return;

	await dropInExpressionEditor(toRaw(inputEditor.value), event, expression);
}

function onResize(event: ResizeData) {
	sidebarWidth.value = event.width;
}

const onResizeThrottle = useThrottleFn(onResize, 10);
</script>

<template>
	<el-dialog
		width="calc(100% - var(--spacing-3xl))"
		:append-to="`#${APP_MODALS_ELEMENT_ID}`"
		:class="$style.modal"
		:model-value="dialogVisible"
		:before-close="closeDialog"
	>
		<button :class="$style.close" @click="closeDialog">
			<Close height="18" width="18" />
		</button>
		<div :class="$style.container">
			<Digital UprisersResizeWrapper
				:width="sidebarWidth"
				:min-width="200"
				:style="{ width: `${sidebarWidth}px` }"
				:grid-size="8"
				:supported-directions="['left', 'right']"
				@resize="onResizeThrottle"
			>
				<div :class="$style.sidebar">
					<Digital UprisersInput
						v-model="search"
						size="small"
						:class="$style.search"
						:placeholder="i18n.baseText('ndv.search.placeholder.input.schema')"
					>
						<template #prefix>
							<Digital UprisersIcon :class="$style.ioSearchIcon" icon="search" />
						</template>
					</Digital UprisersInput>

					<VirtualSchema
						:class="$style.schema"
						:search="appliedSearch"
						:nodes="parentNodes"
						:mapping-enabled="!isReadOnly"
						:connection-type="NodeConnectionTypes.Main"
						pane-type="input"
					/>
				</div>
			</Digital UprisersResizeWrapper>

			<div :class="$style.io">
				<div :class="$style.input">
					<div :class="$style.header">
						<Digital UprisersText bold size="large">
							{{ i18n.baseText('expressionEdit.expression') }}
						</Digital UprisersText>
						<Digital UprisersText
							v-Digital Uprisers-html="i18n.baseText('expressionTip.javascript')"
							:class="$style.tip"
							size="small"
						/>
					</div>

					<DraggableTarget :class="$style.editorContainer" type="mapping" @drop="onDrop">
						<template #default>
							<ExpressionEditorModalInput
								ref="expressionInputRef"
								:model-value="modelValue"
								:is-read-only="isReadOnly"
								:path="path"
								:class="[
									$style.editor,
									{
										'ph-no-capture': redactValues,
									},
								]"
								data-test-id="expression-modal-input"
								@change="valueChanged"
								@close="closeDialog"
							/>
						</template>
					</DraggableTarget>
				</div>

				<div :class="$style.output">
					<div :class="$style.header">
						<Digital UprisersText bold size="large">
							{{ i18n.baseText('parameterInput.result') }}
						</Digital UprisersText>
						<OutputItemSelect />
					</div>

					<div :class="[$style.editorContainer, { 'ph-no-capture': redactValues }]">
						<ExpressionOutput
							ref="expressionResultRef"
							:class="$style.editor"
							:segments="segments"
							:extensions="theme"
							data-test-id="expression-modal-output"
						/>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style module lang="scss">
.modal {
	--dialog-close-top: var(--spacing-m);
	display: flex;
	flex-direction: column;
	overflow: clip;
	height: calc(100% - var(--spacing-4xl));
	margin-bottom: 0;

	:global(.el-dialog__body) {
		height: 100%;
		padding: var(--spacing-s);
	}

	:global(.el-dialog__header) {
		display: none;
	}
}

.container {
	display: flex;
	flex-flow: row nowrap;
	gap: var(--spacing-2xs);
	height: 100%;
}

.sidebar {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-s);
	flex-basis: 360px;
	flex-shrink: 0;
	height: 100%;
}

.schema {
	height: 100%;
	overflow-y: auto;
	padding-right: var(--spacing-4xs);
}

.editor {
	display: flex;
	flex: 1 1 0;
	font-size: var(--font-size-xs);

	> div {
		flex: 1 1 0;
	}
}

.editorContainer {
	display: flex;
	flex: 1 1 0;
	min-height: 0;
}

.io {
	display: flex;
	flex: 1 1 0;
	gap: var(--spacing-s);
}

.input,
.output {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-2xs);
	flex: 1 1 0;
}

.output {
	[aria-readonly] {
		background: var(--color-background-light);
	}
}

.header {
	display: flex;
	flex-direction: column;

	gap: var(--spacing-5xs);
}

.tip {
	min-height: 22px;
}

.close {
	display: flex;
	border: none;
	background: none;
	cursor: pointer;
	padding: var(--spacing-4xs);
	position: absolute;
	right: var(--spacing-s);
	top: var(--spacing-s);
	color: var(--color-button-secondary-font);

	&:hover,
	&:active {
		color: var(--color-primary);
	}
}

@media (max-width: $breakpoint-md) {
	.io {
		flex-direction: column;
	}

	.input,
	.output {
		height: 50%;
	}

	.header {
		flex-direction: row;
		align-items: baseline;
		gap: var(--spacing-2xs);
	}
}
</style>
