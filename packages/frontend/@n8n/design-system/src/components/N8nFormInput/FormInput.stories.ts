import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersFormInput from './FormInput.vue';

export default {
	title: 'Modules/FormInput',
	component: Digital UprisersFormInput,
	argTypes: {},
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
		Digital UprisersFormInput,
	},
	template: `
		<Digital Uprisers-form-input v-bind="args" v-model="val" @update:modelValue="onUpdateModelValue" @change="onChange" @focus="onFocus" />
	`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const FormInput = Template.bind({});
FormInput.args = {
	label: 'Label',
	placeholder: 'placeholder',
};
