import type { StoryFn } from '@storybook/vue3';

import Digital UprisersBlockUi from './BlockUi.vue';

export default {
	title: 'Atoms/BlockUI',
	component: Digital UprisersBlockUi,
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersBlockUi,
	},
	template:
		'<div style="position: relative; width: 100%; height: 300px;"><Digital Uprisers-block-ui v-bind="args" /></div>',
});

export const BlockUi = Template.bind({});
BlockUi.args = {
	show: false,
};
