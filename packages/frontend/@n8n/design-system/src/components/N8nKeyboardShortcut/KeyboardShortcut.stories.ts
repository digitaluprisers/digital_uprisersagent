import type { StoryFn } from '@storybook/vue3';

import Digital UprisersKeyboardShorcut from './Digital UprisersKeyboardShortcut.vue';

export default {
	title: 'Atoms/KeyboardShortcut',
	component: Digital UprisersKeyboardShorcut,
};

const template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersKeyboardShorcut,
	},
	template: '<Digital Uprisers-keyboard-shortcut v-bind="args" />',
});

export const defaultShortcut = template.bind({});
defaultShortcut.args = {
	keys: ['s'],
	altKey: true,
	metaKey: true,
	shiftKey: true,
};
