import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersCheckbox from './Checkbox.vue';

export default {
	title: 'Atoms/Checkbox',
	component: Digital UprisersCheckbox,
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
	onFocus: action('focus'),
	onChange: action('change'),
};

const DefaultTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersCheckbox,
	},
	data: () => ({
		isChecked: false,
	}),
	template:
		'<Digital Uprisers-checkbox v-model="isChecked" v-bind="args" @update:modelValue="onUpdateModelValue"></Digital Uprisers-checkbox>',
	methods,
});

export const Default = DefaultTemplate.bind({});
Default.args = {
	label: 'This is a default checkbox',
	tooltipText: 'Checkbox tooltip',
	disabled: false,
	indeterminate: false,
	size: 'small',
};
