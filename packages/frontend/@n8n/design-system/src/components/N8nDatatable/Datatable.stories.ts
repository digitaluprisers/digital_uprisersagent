import type { StoryFn } from '@storybook/vue3';

import { rows, columns } from './__tests__/data';
import Digital UprisersDatatable from './Datatable.vue';

export default {
	title: 'Atoms/Datatable',
	component: Digital UprisersDatatable,
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		Digital UprisersDatatable,
	},
	template: '<Digital Uprisers-datatable v-bind="args"></Digital Uprisers-datatable>',
});

Default.args = {
	columns,
	rows,
};
