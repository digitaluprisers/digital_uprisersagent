import type { StoryFn } from '@storybook/vue3';

import Digital UprisersIcon from './Icon.vue';

export default {
	title: 'Atoms/Icon',
	component: Digital UprisersIcon,
	argTypes: {
		icon: {
			control: 'text',
		},
		size: {
			control: {
				type: 'select',
			},
			options: ['xsmall', 'small', 'medium', 'large'],
		},
		spin: {
			control: {
				type: 'boolean',
			},
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersIcon,
	},
	template: '<Digital Uprisers-icon v-bind="args" />',
});

export const Clock = Template.bind({});
Clock.args = {
	icon: 'clock',
};

export const Plus = Template.bind({});
Plus.args = {
	icon: 'plus',
};

export const Stop = Template.bind({});
Stop.args = {
	icon: 'stop',
};
