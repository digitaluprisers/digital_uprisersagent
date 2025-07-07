import type { StoryFn } from '@storybook/vue3';

import Digital UprisersBadge from './Badge.vue';

export default {
	title: 'Atoms/Badge',
	component: Digital UprisersBadge,
	argTypes: {
		theme: {
			type: 'text',
			options: ['default', 'primary', 'secondary', 'tertiary'],
		},
		size: {
			type: 'select',
			options: ['small', 'medium', 'large'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersBadge,
	},
	template: '<Digital Uprisers-badge v-bind="args">Badge</Digital Uprisers-badge>',
});

export const Badge = Template.bind({});
Badge.args = {};
