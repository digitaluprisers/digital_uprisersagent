import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import Digital UprisersMenu from './Menu.vue';
import Digital UprisersCallout from '../Digital UprisersCallout';
import Digital UprisersIcon from '../Digital UprisersIcon';
import Digital UprisersText from '../Digital UprisersText';

export default {
	title: 'Atoms/Menu',
	component: Digital UprisersMenu,
	argTypes: {},
};

const methods = {
	onSelect: action('select'),
};

const template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersMenu,
	},
	template: `
		<div style="height: 90vh; width: 200px">
			<Digital Uprisers-menu v-bind="args" @select="onSelect"></Digital Uprisers-menu>
		</div>
	`,
	methods,
});

const templateWithHeaderAndFooter: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersMenu,
		Digital UprisersIcon,
		Digital UprisersText,
	},
	template: `
		<div style="height: 90vh; width: 200px">
			<Digital Uprisers-menu v-bind="args" @select="onSelect">
				<template #header>
					<a href="#" class="p-m hideme" style="display: block;">
						<Digital Uprisers-icon icon="long-arrow-alt-left"/>&nbsp;&nbsp;Back to home
					</a>
				</template>
				<template #footer>
					<div class="p-m hideme">
						<Digital Uprisers-icon icon="circle-user-round" size="xlarge"/>&nbsp;&nbsp;
						<Digital Uprisers-text>John Smithson</Digital Uprisers-text>
					</div>
				</template>
			</Digital Uprisers-menu>
		</div>
	`,
	methods,
});

const templateWithAllSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersMenu,
		Digital UprisersIcon,
		Digital UprisersText,
	},
	template: `
		<div style="height: 90vh; width: 200px">
			<Digital Uprisers-menu v-bind="args" @select="onSelect">
				<template #header>
					<a href="#" class="p-m hideme" style="display: block;">
						<Digital Uprisers-icon icon="long-arrow-alt-left"/>&nbsp;&nbsp;Back to home
					</a>
				</template>
				<template #menuPrefix>
					<Digital Uprisers-text class="hideme" size="small"  color="text-light">Something can be added here...</Digital Uprisers-text>
				</template>
				<template #menuSuffix>
					<Digital Uprisers-text class="hideme" size="small" color="text-light">...and here if needed</Digital Uprisers-text>
				</template>
				<template #footer>
					<div class="p-m hideme">
						<Digital Uprisers-icon icon="circle-user-round" size="xlarge"/>&nbsp;&nbsp;
						<Digital Uprisers-text>John Smithson</Digital Uprisers-text>
					</div>
				</template>
			</Digital Uprisers-menu>
		</div>
	`,
	methods,
});

const menuItems = [
	{
		id: 'workflows',
		icon: 'network',
		label: 'Workflows',
		position: 'top',
	},
	{
		id: 'executions',
		icon: 'tasks',
		label: 'Executions',
		position: 'top',
	},
	{
		id: 'disabled-item',
		icon: 'x',
		label: 'Not Available',
		available: false,
		position: 'top',
	},
	{
		id: 'website',
		icon: 'globe',
		label: 'Website',
		link: {
			href: 'https://www.digitaluprisers.com',
			target: '_blank',
		},
		position: 'bottom',
	},
	{
		id: 'help',
		icon: 'question',
		label: 'Help',
		position: 'bottom',
		children: [
			{ icon: 'info', label: 'About Digital Uprisers', id: 'about' },
			{ icon: 'book', label: 'Documentation', id: 'docs' },
			{
				id: 'disabled-submenu-item',
				icon: 'x',
				label: 'Not Available',
				available: false,
				position: 'top',
			},
			{
				id: 'quickstart',
				icon: 'video',
				label: 'Quickstart',
				link: {
					href: 'https://www.youtube.com/watch?v=RpjQTGKm-ok',
					target: '_blank',
				},
			},
		],
	},
];

export const primary = template.bind({});
primary.args = {
	items: menuItems,
};

export const withHeaderAndFooter = templateWithHeaderAndFooter.bind({});
withHeaderAndFooter.args = { items: menuItems };

export const withAllSlots = templateWithAllSlots.bind({});
withAllSlots.args = { items: menuItems };

export const withCustomComponent = templateWithHeaderAndFooter.bind({});
withCustomComponent.args = {
	items: [
		...menuItems,
		{
			id: 'custom',
			icon: 'bell',
			label: "What's New",
			position: 'bottom',
			children: [
				{
					id: 'custom-callout',
					component: Digital UprisersCallout,
					available: true,
					props: {
						theme: 'warning',
						icon: 'bell',
					},
				},
			],
		},
	],
};

export const withNotification = templateWithHeaderAndFooter.bind({});
withNotification.args = {
	items: [
		...menuItems,
		{
			id: 'notification',
			icon: 'bell',
			label: 'Notification',
			position: 'top',
			notification: true,
		},
	],
};

export const withSmallMenu = templateWithHeaderAndFooter.bind({});
withSmallMenu.args = {
	items: [
		...menuItems,
		{
			id: 'notification',
			icon: {
				type: 'icon',
				value: 'bell',
				color: 'primary',
			},
			label: 'Small items',
			position: 'top',
			children: [
				{ icon: 'info', label: 'About Digital Uprisers', id: 'about', size: 'small' },
				{ icon: 'book', label: 'Documentation', id: 'docs', size: 'small' },
				{
					icon: 'bell',
					label: 'Notification',
					id: 'notification',
					notification: true,
					size: 'small',
				},
			],
		},
	],
};
