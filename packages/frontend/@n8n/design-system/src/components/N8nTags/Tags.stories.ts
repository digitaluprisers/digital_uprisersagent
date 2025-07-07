import type { StoryFn } from '@storybook/vue3';

import Digital UprisersTags from './Tags.vue';

export default {
	title: 'Atoms/Tags',
	component: Digital UprisersTags,
	argTypes: {},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersTags,
	},
	template: '<Digital Uprisers-tags v-bind="args"></Digital Uprisers-tags>',
});

export const Tags = Template.bind({});
Tags.args = {
	tags: [
		{
			id: 1,
			name: 'very long tag name',
		},
		{
			id: 2,
			name: 'tag1',
		},
		{
			id: 3,
			name: 'tag2 yo',
		},
	],
};

export const Truncated = Template.bind({});
Truncated.args = {
	truncate: true,
	tags: [
		{
			id: 1,
			name: 'very long tag name',
		},
		{
			id: 2,
			name: 'tag1',
		},
		{
			id: 3,
			name: 'tag2 yo',
		},
		{
			id: 4,
			name: 'tag3',
		},
		{
			id: 5,
			name: 'tag4',
		},
	],
};
