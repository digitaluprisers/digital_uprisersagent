import type { StoryFn } from '@storybook/vue3';

import Digital UprisersNotice from './Notice.vue';

export default {
	title: 'Atoms/Notice',
	component: Digital UprisersNotice,
	argTypes: {
		theme: {
			control: 'select',
			options: ['success', 'warning', 'danger', 'info'],
		},
	},
};

const SlotTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersNotice,
	},
	template:
		'<Digital Uprisers-notice v-bind="args">This is a notice! Thread carefully from this point forward.</Digital Uprisers-notice>',
});

const PropTemplate: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersNotice,
	},
	template: '<Digital Uprisers-notice v-bind="args"/>',
});

export const Warning = SlotTemplate.bind({});
Warning.args = {
	theme: 'warning',
};

export const Danger = SlotTemplate.bind({});
Danger.args = {
	theme: 'danger',
};

export const Success = SlotTemplate.bind({});
Success.args = {
	theme: 'success',
};

export const Info = SlotTemplate.bind({});
Info.args = {
	theme: 'info',
};

export const Sanitized = PropTemplate.bind({});
Sanitized.args = {
	theme: 'warning',
	content:
		'<script>alert(1)</script> This content contains a script tag and is <strong>sanitized</strong>.',
};

export const FullContent = PropTemplate.bind({});
FullContent.args = {
	theme: 'warning',
	content: 'This is just the summary. <a data-key="toggle-expand">Show more</a>',
	fullContent:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ut labore et dolore magna aliqua. <a data-key="show-less">Show less</a>',
};

export const HtmlEdgeCase = PropTemplate.bind({});
HtmlEdgeCase.args = {
	theme: 'warning',
	content:
		'This content is long and will be truncated at 150 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <a href="">read the documentation</a> ut labore et dolore magna aliqua.',
};
