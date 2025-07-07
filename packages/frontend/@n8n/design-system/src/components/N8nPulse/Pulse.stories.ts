import type { StoryFn } from '@storybook/vue3';

import Digital UprisersPulse from './Pulse.vue';

export default {
	title: 'Atoms/Pulse',
	component: Digital UprisersPulse,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

export const Default: StoryFn = () => ({
	components: {
		Digital UprisersPulse,
	},
	template: '<Digital Uprisers-pulse> yo </Digital Uprisers-pulse>',
});
