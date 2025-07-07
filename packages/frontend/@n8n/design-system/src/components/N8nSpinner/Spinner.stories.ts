import type { StoryFn } from '@storybook/vue3';

import Digital UprisersSpinner from './Spinner.vue';

export default {
	title: 'Atoms/Spinner',
	component: Digital UprisersSpinner,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['small', 'medium', 'large'],
		},
		type: {
			control: {
				type: 'select',
			},
			options: ['dots', 'ring'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersSpinner,
	},
	template: '<Digital Uprisers-spinner v-bind="args" />',
});

export const Spinner = Template.bind({});
