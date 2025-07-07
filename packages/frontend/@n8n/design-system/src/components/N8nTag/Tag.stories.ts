import type { StoryFn } from '@storybook/vue3';

import Digital UprisersTag from './Tag.vue';

export default {
	title: 'Atoms/Tag',
	component: Digital UprisersTag,
	argTypes: {
		text: {
			control: {
				control: 'text',
			},
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersTag,
	},
	template: '<Digital Uprisers-tag v-bind="args"></Digital Uprisers-tag>',
});

export const Tag = Template.bind({});
Tag.args = {
	text: 'tag name',
};
