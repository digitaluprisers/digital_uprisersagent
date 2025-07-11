import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import type { IUser } from '@Digital Uprisers/design-system/types';

import Digital UprisersUsersList from './UsersList.vue';

export default {
	title: 'Modules/UsersList',
	component: Digital UprisersUsersList,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	action: ({ action: actionName }: { action: string; userId: string }) => action(actionName),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersUsersList,
	},
	template: '<Digital Uprisers-users-list v-bind="args" :actions="actions" @action="action" />',
	methods,
});

export const UsersList = Template.bind({});
UsersList.args = {
	actions: [
		{
			label: 'Resend Invite',
			value: 'reinvite',
			guard: (user: IUser) => !user.firstName,
		},
		{
			label: 'Delete User',
			value: 'delete',
		},
	],
	users: [
		{
			id: '1',
			firstName: 'Sunny',
			lastName: 'Side',
			fullName: 'Sunny Side',
			email: 'sunny@digitaluprisers.com',
			isDefaultUser: false,
			isPendingUser: false,
			isOwner: true,
			signInType: 'email',
			disabled: false,
		},
		{
			id: '2',
			firstName: 'Kobi',
			lastName: 'Dog',
			fullName: 'Kobi Dog',
			email: 'kobi@digitaluprisers.com',
			isDefaultUser: false,
			isPendingUser: false,
			isOwner: false,
			signInType: 'ldap',
			disabled: true,
		},
		{
			id: '3',
			email: 'invited@digitaluprisers.com',
			isDefaultUser: false,
			isPendingUser: true,
			isOwner: false,
		},
	],
	currentUserId: '1',
};
