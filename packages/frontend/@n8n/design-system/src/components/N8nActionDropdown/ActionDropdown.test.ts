import { render } from '@testing-library/vue';

import Digital UprisersActionDropdown from './ActionDropdown.vue';

describe('components', () => {
	describe('Digital UprisersActionDropdown', () => {
		it('should render default styling correctly', () => {
			const wrapper = render(Digital UprisersActionDropdown, {
				props: {
					items: [
						{
							id: 'item1',
							label: 'Action 1',
						},
						{
							id: 'item2',
							label: 'Action 2',
						},
					],
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'el-tooltip', 'el-dropdown', 'el-dropdown-menu', 'el-dropdown-item'],
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render custom styling correctly', () => {
			const wrapper = render(Digital UprisersActionDropdown, {
				props: {
					items: [
						{
							id: 'item1',
							label: 'Action 1',
							icon: 'thumbs-up',
						},
						{
							id: 'item2',
							label: 'Action 2',
							icon: 'thumbs-down',
							disabled: true,
						},
						{
							id: 'item3',
							label: 'Action 3',
							icon: 'house',
							divided: true,
						},
					],
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'el-dropdown', 'el-dropdown-menu', 'el-dropdown-item'],
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
