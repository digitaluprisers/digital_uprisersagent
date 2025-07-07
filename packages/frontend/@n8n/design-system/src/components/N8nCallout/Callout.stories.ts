import type { StoryFn } from '@storybook/vue3';

import Digital UprisersCallout from './Callout.vue';
import Digital UprisersLink from '../Digital UprisersLink';
import Digital UprisersText from '../Digital UprisersText';

export default {
	title: 'Atoms/Callout',
	component: Digital UprisersCallout,
	argTypes: {
		theme: {
			control: {
				type: 'select',
			},
			options: ['info', 'secondary', 'success', 'warning', 'danger', 'custom'],
		},
		message: {
			control: {
				type: 'text',
			},
		},
		icon: {
			control: {
				type: 'text',
			},
		},
	},
	parameters: {
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/tPpJvbrnHbP8C496cYuwyW/Node-pinning?node-id=15%3A5777',
		},
	},
};

interface Args {
	theme: string;
	icon: string;
	default: string;
	actions: string;
	trailingContent: string;
}

const template: StoryFn<Args> = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersLink,
		Digital UprisersText,
		Digital UprisersCallout,
	},
	template: `
		<Digital Uprisers-callout v-bind="args">
			${args.default}
			<template #actions v-if="args.actions">
				${args.actions}
			</template>
			<template #trailingContent v-if="args.trailingContent">
				${args.trailingContent}
			</template>
		</Digital Uprisers-callout>
	`,
});

export const defaultCallout = template.bind({});
defaultCallout.args = {
	theme: 'success',
	default: `
		This is a default callout.
	`,
};

export const customCallout = template.bind({});
customCallout.args = {
	theme: 'custom',
	icon: 'git-branch',
	default: `
		This is a custom callout.
	`,
	actions: `
		<Digital Uprisers-link size="small">
			Do something!
		</Digital Uprisers-link>
	`,
};

export const secondaryCallout = template.bind({});
secondaryCallout.args = {
	theme: 'secondary',
	icon: 'pin',
	default: `
		This data is pinned.
	`,
	actions: `
		<Digital Uprisers-link theme="secondary" size="small" :bold="true" :underline="true">
			Unpin
		</Digital Uprisers-link>
	`,
	trailingContent: `
		<Digital Uprisers-link
			theme="secondary"
			size="small"
			:bold="true"
			:underline="true"
			to="https://digitaluprisers.com"
		>
			Learn more
		</Digital Uprisers-link>
	`,
};
