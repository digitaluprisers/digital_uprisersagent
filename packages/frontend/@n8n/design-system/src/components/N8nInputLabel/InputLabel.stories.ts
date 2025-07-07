import type { StoryFn } from '@storybook/vue3';

import Digital UprisersInputLabel from './InputLabel.vue';
import Digital UprisersInput from '../Digital UprisersInput';

export default {
	title: 'Atoms/Input Label',
	component: Digital UprisersInputLabel,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersInputLabel,
		Digital UprisersInput,
	},
	template: `<div style="margin-top:50px">
			<Digital Uprisers-input-label v-bind="args">
				<Digital Uprisers-input />
			</Digital Uprisers-input-label>
		</div>`,
});

export const InputLabel = Template.bind({});
InputLabel.args = {
	label: 'input label',
	tooltipText: 'more info...',
};
