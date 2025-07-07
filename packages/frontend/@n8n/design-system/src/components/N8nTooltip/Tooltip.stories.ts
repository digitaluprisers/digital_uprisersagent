import type { StoryFn } from '@storybook/vue3';

import Digital UprisersTooltip from './Tooltip.vue';

export default {
	title: 'Atoms/Tooltip',
	component: Digital UprisersTooltip,
	argTypes: {
		effect: {
			control: 'select',
			options: ['dark', 'light'],
		},
		placement: {
			control: 'select',
			options: [
				'top',
				'top-start',
				'top-end',
				'bottom',
				'bottom-start',
				'bottom-end',
				'left',
				'left-start',
				'left-end',
				'right',
				'right-start',
				'right-end',
			],
		},
		disabled: {
			control: { type: 'boolean' },
		},
	},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersTooltip,
	},
	template: '<Digital Uprisers-tooltip v-bind="args"><button>Hover me</button></Digital Uprisers-tooltip>',
});

export const Tooltip = Template.bind({});
Tooltip.args = {
	content: '...',
};

export const TooltipWithButtons = Template.bind({});
TooltipWithButtons.args = {
	content: 'Hello world!',
	buttons: [
		{
			attrs: {
				label: 'Button 1',
				'data-test-id': 'tooltip-button',
			},
			listeners: {
				onClick: () => alert('Clicked 1'),
			},
		},
		{
			attrs: {
				label: 'Button 2',
				'data-test-id': 'tooltip-button',
			},
			listeners: {
				onClick: () => alert('Clicked 2'),
			},
		},
	],
};
