import type { StoryFn } from '@storybook/vue3';

import Digital UprisersInfoTip from './InfoTip.vue';

export default {
	title: 'Atoms/InfoTip',
	component: Digital UprisersInfoTip,
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersInfoTip,
	},
	template:
		'<Digital Uprisers-info-tip v-bind="args">Need help doing something? <a href="/docs" target="_blank">Open docs</a></Digital Uprisers-info-tip>',
});

export const Note = Template.bind({});

export const Tooltip = Template.bind({});
Tooltip.args = {
	type: 'tooltip',
	tooltipPlacement: 'right',
};
