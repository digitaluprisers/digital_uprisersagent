import type { StoryFn } from '@storybook/vue3';

import Digital UprisersAvatar from './Avatar.vue';

export default {
	title: 'Atoms/Avatar',
	component: Digital UprisersAvatar,
	argTypes: {
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
		Digital UprisersAvatar,
	},
	template: '<Digital Uprisers-avatar v-bind="args" />',
});

export const Avatar = Template.bind({});
Avatar.args = {
	firstName: 'Sunny',
	lastName: 'Side',
};
