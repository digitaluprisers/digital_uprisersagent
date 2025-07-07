import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersLink from './Link.vue';

export default {
	title: 'Atoms/Link',
	component: Digital UprisersLink,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['small', 'medium', 'large'],
		},
	},
};

const methods = {
	onClick: action('click'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersLink,
	},
	template: '<Digital Uprisers-link v-bind="args" @click="onClick">hello world</Digital Uprisers-link>',
	methods,
});

export const Link = Template.bind({});
Link.args = {
	href: 'https://digitaluprisers.com/',
};
