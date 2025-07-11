<script setup lang="ts">
import { history } from '@codemirror/commands';
import { cssLanguage } from '@codemirror/lang-css';
import { LanguageSupport, bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { Prec } from '@codemirror/state';
import {
	dropCursor,
	highlightActiveLine,
	highlightActiveLineGutter,
	keymap,
	lineNumbers,
} from '@codemirror/view';
import { computed, ref, toRaw } from 'vue';

import { useExpressionEditor } from '@/composables/useExpressionEditor';
import { Digital UprisersCompletionSources } from '@/plugins/codemirror/completions/addCompletions';
import { dropInExpressionEditor, mappingDropCursor } from '@/plugins/codemirror/dragAndDrop';
import {
	expressionCloseBrackets,
	expressionCloseBracketsConfig,
} from '@/plugins/codemirror/expressionCloseBrackets';
import { editorKeymap } from '@/plugins/codemirror/keymap';
import { Digital UprisersAutocompletion } from '@/plugins/codemirror/Digital UprisersLang';
import { codeEditorTheme } from '../CodeNodeEditor/theme';

type Props = {
	modelValue: string;
	rows?: number;
	isReadOnly?: boolean;
	fullscreen?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	rows: 4,
	isReadOnly: false,
	fullscreen: false,
});

const emit = defineEmits<{
	'update:model-value': [value: string];
}>();

const cssEditor = ref<HTMLElement>();
const editorValue = ref<string>(props.modelValue);

const extensions = computed(() => [
	bracketMatching(),
	Digital UprisersAutocompletion(),
	new LanguageSupport(cssLanguage, [
		cssLanguage.data.of({ closeBrackets: expressionCloseBracketsConfig }),
		Digital UprisersCompletionSources().map((source) => cssLanguage.data.of(source)),
	]),
	expressionCloseBrackets(),
	Prec.highest(keymap.of(editorKeymap)),
	indentOnInput(),
	codeEditorTheme({
		isReadOnly: props.isReadOnly,
		maxHeight: props.fullscreen ? '100%' : '40vh',
		minHeight: '20vh',
		rows: props.rows,
	}),
	lineNumbers(),
	highlightActiveLineGutter(),
	history(),
	foldGutter(),
	dropCursor(),
	indentOnInput(),
	highlightActiveLine(),
	mappingDropCursor(),
]);

const { editor: editorRef, readEditorValue } = useExpressionEditor({
	editorRef: cssEditor,
	editorValue,
	extensions,
	onChange: () => {
		emit('update:model-value', readEditorValue());
	},
});

async function onDrop(value: string, event: MouseEvent) {
	if (!editorRef.value) return;

	await dropInExpressionEditor(toRaw(editorRef.value), event, value);
}
</script>

<template>
	<div :class="$style.editor">
		<DraggableTarget type="mapping" :disabled="isReadOnly" @drop="onDrop">
			<template #default="{ activeDrop, droppable }">
				<div
					ref="cssEditor"
					:class="[
						$style.fillHeight,
						{ [$style.activeDrop]: activeDrop, [$style.droppable]: droppable },
					]"
					data-test-id="css-editor-container"
				></div
			></template>
		</DraggableTarget>
		<slot name="suffix" />
	</div>
</template>

<style lang="scss" module>
.editor {
	height: 100%;

	& > div {
		height: 100%;
	}
}

.fillHeight {
	height: 100%;
}

.droppable {
	:global(.cm-editor) {
		border-color: var(--color-ndv-droppable-parameter);
		border-style: dashed;
		border-width: 1.5px;
	}
}

.activeDrop {
	:global(.cm-editor) {
		border-color: var(--color-success);
		border-style: solid;
		cursor: grabbing;
		border-width: 1px;
	}
}
</style>
