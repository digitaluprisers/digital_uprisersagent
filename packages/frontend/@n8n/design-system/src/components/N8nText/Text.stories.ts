import type { StoryFn } from '@storybook/vue3';

import Digital UprisersText from './Text.vue';

export default {
	title: 'Atoms/Text',
	component: Digital UprisersText,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['xsmall', 'small', 'medium', 'large'],
		},
		color: {
			control: {
				type: 'select',
			},
			options: [
				'primary',
				'text-dark',
				'text-base',
				'text-light',
				'text-xlight',
				'danger',
				'success',
			],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersText,
	},
	template: '<Digital Uprisers-text v-bind="args">hello world</Digital Uprisers-text>',
});

export const Text = Template.bind({});
