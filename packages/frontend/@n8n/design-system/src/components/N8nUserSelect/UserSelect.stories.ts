import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersUserSelect from './UserSelect.vue';

export default {
	title: 'Modules/UserSelect',
	component: Digital UprisersUserSelect,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onChange: action('change'),
	onBlur: action('blur'),
	onFocus: action('focus'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersUserSelect,
	},
	template:
		'<Digital Uprisers-user-select v-bind="args" v-model="val" @change="onChange" @blur="onBlur" @focus="onFocus" />',
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const UserSelect = Template.bind({});
UserSelect.args = {
	users: [
		{
			id: '1',
			firstName: 'Sunny',
			lastName: 'Side',
			email: 'sunny@digitaluprisers.com',
		},
		{
			id: '2',
			firstName: 'Kobi',
			lastName: 'Dog',
			email: 'kobi@digitaluprisers.com',
		},
		{
			id: '3',
			email: 'invited@digitaluprisers.com',
		},
	],
	placeholder: 'Select user to transfer to',
	currentUserId: '1',
};
