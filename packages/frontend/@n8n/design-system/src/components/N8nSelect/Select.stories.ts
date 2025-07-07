import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersSelect from './Select.vue';
import Digital UprisersIcon from '../Digital UprisersIcon';
import Digital UprisersOption from '../Digital UprisersOption';

export default {
	title: 'Atoms/Select',
	component: Digital UprisersSelect,
	argTypes: {
		disabled: {
			control: {
				type: 'boolean',
			},
		},
		size: {
			control: {
				type: 'select',
			},
			options: ['large', 'medium', 'small', 'mini'],
		},
		loading: {
			control: {
				type: 'boolean',
			},
		},
		filterable: {
			control: {
				type: 'boolean',
			},
		},
		defaultFirstOption: {
			control: {
				type: 'boolean',
			},
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
	onChange: action('change'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersSelect,
		Digital UprisersOption,
		Digital UprisersIcon,
	},
	template:
		'<Digital Uprisers-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange"><Digital Uprisers-option value="1">op1</Digital Uprisers-option><Digital Uprisers-option value="2">op2</Digital Uprisers-option></Digital Uprisers-select>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const Input = Template.bind({});

export const Filterable = Template.bind({});
Filterable.args = {
	filterable: true,
	defaultFirstOption: true,
};

const selects = ['large', 'medium', 'small', 'mini']
	.map(
		(size) =>
			`<Digital Uprisers-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" size="${size}"><Digital Uprisers-option value="1">op1</Digital Uprisers-option><Digital Uprisers-option value="2">op2</Digital Uprisers-option></Digital Uprisers-select>`,
	)
	.join('');

const ManyTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersSelect,
		Digital UprisersOption,
		Digital UprisersIcon,
	},
	template: `<div class="multi-container">${selects}</div>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Sizes = ManyTemplate.bind({});
Sizes.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};

const selectsWithIcon = ['xlarge', 'large', 'medium', 'small', 'mini']
	.map(
		(size) =>
			`<Digital Uprisers-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" size="${size}"><Digital Uprisers-icon icon="search" slot="prefix" /><Digital Uprisers-option value="1">op1</Digital Uprisers-option><Digital Uprisers-option value="2">op2</Digital Uprisers-option></Digital Uprisers-select>`,
	)
	.join('');

const ManyTemplateWithIcon: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersSelect,
		Digital UprisersOption,
		Digital UprisersIcon,
	},
	template: `<div class="multi-container">${selectsWithIcon}</div>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const WithIcon = ManyTemplateWithIcon.bind({});
WithIcon.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};

const LimitedWidthTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersSelect,
		Digital UprisersOption,
		Digital UprisersIcon,
	},
	template:
		'<div style="width:100px;"><Digital Uprisers-select v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange"><Digital Uprisers-option value="1" label="opt1 11 1111" /><Digital Uprisers-option value="2" label="opt2 test very long ipsum"/></Digital Uprisers-select></div>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const LimitedWidth = LimitedWidthTemplate.bind({});
LimitedWidth.args = {
	type: 'text',
	label: 'text input:',
	placeholder: 'placeholder...',
};
