import type { StoryFn } from '@storybook/vue3';

import Digital UprisersCard from './Card.vue';
import Digital UprisersButton from '../Digital UprisersButton/Button.vue';
import Digital UprisersIcon from '../Digital UprisersIcon/Icon.vue';
import Digital UprisersText from '../Digital UprisersText/Text.vue';

export default {
	title: 'Atoms/Card',
	component: Digital UprisersCard,
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersCard,
	},
	template: '<Digital Uprisers-card v-bind="args">This is a card.</Digital Uprisers-card>',
});

export const Hoverable: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersCard,
		Digital UprisersIcon,
		Digital UprisersText,
	},
	template: `<div style="width: 140px; text-align: center;">
		<Digital Uprisers-card v-bind="args">
			<Digital Uprisers-icon icon="plus" size="xlarge" />
			<Digital Uprisers-text size="large" class="mt-2xs">Add</Digital Uprisers-text>
		</Digital Uprisers-card>
	</div>`,
});

Hoverable.args = {
	hoverable: true,
};

export const WithSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersCard,
		Digital UprisersButton,
		Digital UprisersIcon,
		Digital UprisersText,
	},
	template: `<Digital Uprisers-card v-bind="args">
		<template #prepend>
			<Digital Uprisers-icon icon="check" size="large" />
		</template>
		<template #header>
			<strong>Card header</strong>
		</template>
		<Digital Uprisers-text color="text-light" size="medium" class="mt-2xs mb-2xs">
			This is the card body.
		</Digital Uprisers-text>
		<template #footer>
			<Digital Uprisers-text size="medium">
				Card footer
			</Digital Uprisers-text>
		</template>
		<template #append>
			<Digital Uprisers-button>Click me</Digital Uprisers-button>
		</template>
	</Digital Uprisers-card>`,
});
