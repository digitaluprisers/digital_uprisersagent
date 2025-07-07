import type { StoryFn } from '@storybook/vue3';

import Digital UprisersCircleLoader from './CircleLoader.vue';

export default {
	title: 'Atoms/CircleLoader',
	component: Digital UprisersCircleLoader,
	argTypes: {
		radius: {
			control: {
				type: 'number',
			},
		},
		progress: {
			control: {
				type: 'number',
			},
		},
		strokeWidth: {
			control: {
				type: 'number',
			},
		},
	},
};

interface Args {
	radius: number;
	progress: number;
	strokeWidth: number;
}

const template: StoryFn<Args> = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersCircleLoader,
	},
	template: `
		<div>
			<Digital Uprisers-circle-loader v-bind="args" />
		</div>
	`,
});

export const defaultCircleLoader = template.bind({});
defaultCircleLoader.args = {
	radius: 20,
	progress: 42,
	strokeWidth: 10,
};
