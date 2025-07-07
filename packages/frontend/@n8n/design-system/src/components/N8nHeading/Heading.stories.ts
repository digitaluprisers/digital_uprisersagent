import type { StoryFn } from '@storybook/vue3';

import Digital UprisersHeading from './Heading.vue';

export default {
	title: 'Atoms/Heading',
	component: Digital UprisersHeading,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['2xlarge', 'xlarge', 'large', 'medium', 'small'],
		},
		color: {
			control: {
				type: 'select',
			},
			options: ['primary', 'text-dark', 'text-base', 'text-light', 'text-xlight'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersHeading,
	},
	template: '<Digital Uprisers-heading v-bind="args">hello world</Digital Uprisers-heading>',
});

export const Heading = Template.bind({});
