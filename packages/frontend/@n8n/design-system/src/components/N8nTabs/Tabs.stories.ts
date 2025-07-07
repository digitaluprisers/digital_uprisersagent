import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersTabs from './Tabs.vue';

export default {
	title: 'Atoms/Tabs',
	component: Digital UprisersTabs,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-xlight' },
	},
};

const methods = {
	onUpdateModelValue: action('update:modelValue'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersTabs,
	},
	template: `<Digital Uprisers-tabs v-model="val" v-bind="args" @update:modelValue="onUpdateModelValue">
		</Digital Uprisers-tabs>`,
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const Example = Template.bind({});
Example.args = {
	options: [
		{
			label: 'First',
			value: 'first',
		},
		{
			label: 'Second',
			value: 'second',
		},
		{
			label: 'Github',
			value: 'github',
			href: 'https://github.com/',
		},
		{
			label: 'Settings',
			value: 'settings',
			icon: 'cog',
			align: 'right',
		},
	],
};
