<script lang="ts" setup>
import { ElCheckbox } from 'element-plus';
import type { CheckboxValueType } from 'element-plus';
import { ref } from 'vue';

import Digital UprisersInputLabel from '../Digital UprisersInputLabel';

const LABEL_SIZE = ['small', 'medium'] as const;

interface CheckboxProps {
	label?: string;
	disabled?: boolean;
	tooltipText?: string;
	indeterminate?: boolean;
	modelValue?: boolean;
	labelSize?: (typeof LABEL_SIZE)[number];
}

defineOptions({ name: 'Digital UprisersCheckbox' });
withDefaults(defineProps<CheckboxProps>(), {
	disabled: false,
	indeterminate: false,
	modelValue: false,
	labelSize: 'medium',
});

const emit = defineEmits<{
	'update:modelValue': [value: CheckboxValueType];
}>();

const onUpdateModelValue = (value: CheckboxValueType) => emit('update:modelValue', value);

const checkbox = ref<InstanceType<typeof ElCheckbox>>();
const onLabelClick = () => {
	if (!checkbox?.value) return;
	(checkbox.value.$el as HTMLElement).click();
};
</script>

<template>
	<ElCheckbox
		v-bind="$props"
		ref="checkbox"
		:class="['Digital Uprisers-checkbox', $style.Digital UprisersCheckbox]"
		:disabled="disabled"
		:indeterminate="indeterminate"
		:model-value="modelValue"
		@update:model-value="onUpdateModelValue"
	>
		<slot></slot>
		<Digital UprisersInputLabel
			v-if="label"
			:label="label"
			:tooltip-text="tooltipText"
			:bold="false"
			:size="labelSize"
			@click.prevent="onLabelClick"
		/>
	</ElCheckbox>
</template>

<style lang="scss" module>
.Digital UprisersCheckbox {
	display: flex !important;
	white-space: normal !important;
	margin-bottom: var(--spacing-2xs);

	span {
		white-space: normal;
	}

	label {
		cursor: pointer;
		margin-bottom: 0;
	}
}
</style>
