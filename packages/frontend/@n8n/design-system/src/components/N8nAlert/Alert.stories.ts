import type { StoryFn } from '@storybook/vue3';

import Digital UprisersAlert from './Alert.vue';
import Digital UprisersIcon from '../Digital UprisersIcon';

export default {
	title: 'Atoms/Alert',
	component: Digital UprisersAlert,
	argTypes: {
		type: {
			type: 'select',
			options: ['success', 'info', 'warning', 'error'],
		},
		effect: {
			type: 'select',
			options: ['light', 'dark'],
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersAlert,
	},
	template:
		'<div style="position: relative; width: 100%; height: 300px;"><Digital Uprisers-alert v-bind="args"><template #aside>custom content slot</template></Digital Uprisers-alert></div>',
});

export const ContentAsProps = Template.bind({});
ContentAsProps.args = {
	type: 'info',
	effect: 'light',
	title: 'Alert title',
	description: 'Alert description',
	center: false,
	showIcon: true,
	background: true,
};

const TemplateForSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersAlert,
		Digital UprisersIcon,
	},
	template: `<div style="position: relative; width: 100%; height: 300px;">
			  <Digital Uprisers-alert v-bind="args">
					<template #title>Title</template>
					Description
					<template #aside><button>Button</button></template>
					<template #icon>
						<Digital Uprisers-icon icon="grin-stars" size="xlarge" />
					</template>
				</Digital Uprisers-alert>
		</div>`,
});

export const ContentInSlots = TemplateForSlots.bind({});
ContentInSlots.args = {
	type: 'info',
	effect: 'light',
	center: false,
	background: true,
	showIcon: false,
};
