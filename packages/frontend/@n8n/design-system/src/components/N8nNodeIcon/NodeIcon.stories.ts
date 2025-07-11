import type { StoryFn } from '@storybook/vue3';

import Digital UprisersNodeIcon from './NodeIcon.vue';

export default {
	title: 'Atoms/NodeIcon',
	component: Digital UprisersNodeIcon,
};

const DefaultTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersNodeIcon,
	},
	template: '<Digital Uprisers-node-icon v-bind="args"></Digital Uprisers-node-icon>',
});

export const FileIcon = DefaultTemplate.bind({});
FileIcon.args = {
	type: 'file',
	src: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/cartman.svg',
	size: 200,
};

export const FontIcon = DefaultTemplate.bind({});
FontIcon.args = {
	type: 'icon',
	name: 'cog',
	size: 200,
};

export const Hoverable = DefaultTemplate.bind({});
Hoverable.args = {
	type: 'icon',
	name: 'home',
	color: 'red',
	size: 200,
	nodeTypeName: 'We ❤️ Digital Uprisers',
	showTooltip: true,
};

export const Unknown = DefaultTemplate.bind({});
Unknown.args = {
	type: 'unknown',
	nodeTypeName: '',
	size: 40,
	color: 'red',
};
