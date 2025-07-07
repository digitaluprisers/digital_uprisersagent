import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersInput from './Input.vue';
import Digital UprisersIcon from '../Digital UprisersIcon';

export default {
	title: 'Atoms/Input',
	component: Digital UprisersInput,
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'textarea', 'number', 'password', 'email'],
		},
		placeholder: {
			control: 'text',
		},
		disabled: {
			control: {
				type: 'boolean',
			},
		},
		size: {
			control: 'select',
			options: ['xlarge', 'large', 'medium', 'small', 'mini'],
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
	onFocus: action('focus'),
	onChange: action('change'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersInput,
	},
	template:
		'<Digital Uprisers-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" />',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const Input = Template.bind({});
Input.args = {
	placeholder: 'placeholder...',
};

const ManyTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersInput,
	},
	template:
		'<div class="multi-container"> <Digital Uprisers-input size="xlarge" v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <Digital Uprisers-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <Digital Uprisers-input v-bind="args" size="medium" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <Digital Uprisers-input v-bind="args" size="small" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> <Digital Uprisers-input v-bind="args" v-model="val" size="mini" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" /> </div> ',
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Text = ManyTemplate.bind({});
Text.args = {
	type: 'text',
	placeholder: 'placeholder...',
};

export const TextArea = ManyTemplate.bind({});
TextArea.args = {
	type: 'textarea',
	placeholder: 'placeholder...',
};

const WithPrefix: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersIcon,
		Digital UprisersInput,
	},
	template:
		'<Digital Uprisers-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus"><Digital Uprisers-icon icon="clock" slot="prefix" /></Digital Uprisers-input>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const WithPrefixIcon = WithPrefix.bind({});
WithPrefixIcon.args = {
	placeholder: 'placeholder...',
};

const WithSuffix: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersIcon,
		Digital UprisersInput,
	},
	template:
		'<Digital Uprisers-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus"><Digital Uprisers-icon icon="clock" slot="suffix" /></Digital Uprisers-input>',
	data() {
		return {
			val: '',
		};
	},
	methods,
});

export const WithSuffixIcon = WithSuffix.bind({});
WithSuffixIcon.args = {
	placeholder: 'placeholder...',
};
