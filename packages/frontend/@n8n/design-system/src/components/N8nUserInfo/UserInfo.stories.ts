import type { StoryFn } from '@storybook/vue3';

import Digital UprisersUserInfo from './UserInfo.vue';

export default {
	title: 'Modules/UserInfo',
	component: Digital UprisersUserInfo,
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersUserInfo,
	},
	template: '<Digital Uprisers-user-info v-bind="args" />',
});

export const Member = Template.bind({});
Member.args = {
	firstName: 'Oscar',
	lastName: 'Wilde',
	email: 'test@digitaluprisers.com',
};

export const Current = Template.bind({});
Current.args = {
	firstName: 'Ham',
	lastName: 'Sam',
	email: 'test@digitaluprisers.com',
	isCurrentUser: true,
};

export const Invited = Template.bind({});
Invited.args = {
	email: 'test@digitaluprisers.com',
	isPendingUser: true,
};
