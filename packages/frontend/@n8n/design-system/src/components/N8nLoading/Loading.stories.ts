import type { StoryFn } from '@storybook/vue3';

import Digital UprisersLoading from './Loading.vue';

export default {
	title: 'Atoms/Loading',
	component: Digital UprisersLoading,
	argTypes: {
		animated: {
			control: {
				type: 'boolean',
			},
		},
		loading: {
			control: {
				type: 'boolean',
			},
		},
		rows: {
			control: {
				type: 'select',
			},
			options: [1, 2, 3, 4, 5],
		},
		variant: {
			control: {
				type: 'select',
			},
			options: ['button', 'h1', 'image', 'p'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersLoading,
	},
	template: '<Digital Uprisers-loading v-bind="args"></Digital Uprisers-loading>',
});

export const Loading = Template.bind({});
Loading.args = {
	variant: 'p',
};
