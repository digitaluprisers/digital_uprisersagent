import type { StoryFn } from '@storybook/vue3';

import Digital UprisersPagination from './Pagination.vue';

export default {
	title: 'Atoms/Pagination',
	component: Digital UprisersPagination,
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => {
		const onUpdateCurrentPage = (currentPage: number) => {
			args.currentPage = currentPage;
		};

		const onUpdatePageSize = (pageSize: number) => {
			args.pageSize = pageSize;
		};

		return { onUpdateCurrentPage, onUpdatePageSize, args };
	},
	props: Object.keys(argTypes),
	components: {
		Digital UprisersPagination,
	},
	template: `
		<Digital Uprisers-pagination
			v-bind="args"
			v-model:current-page="args.currentPage"
			v-model:page-size="args.pageSize"
		/>`,
});

export const Pagination: StoryFn = Template.bind({});
Pagination.args = {
	currentPage: 1,
	pagerCount: 5,
	pageSize: 10,
	total: 100,
};
