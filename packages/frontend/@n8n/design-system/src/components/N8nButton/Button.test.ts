import { render } from '@testing-library/vue';

import Digital UprisersButton from './Button.vue';

const slots = {
	default: 'Button',
};
const stubs = ['Digital Uprisers-spinner', 'Digital Uprisers-icon'];

describe('components', () => {
	describe('Digital UprisersButton', () => {
		it('should render correctly', () => {
			const wrapper = render(Digital UprisersButton, {
				slots,
				global: {
					stubs,
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		describe('props', () => {
			describe('loading', () => {
				it('should render loading spinner', () => {
					const wrapper = render(Digital UprisersButton, {
						props: {
							loading: true,
						},
						slots,
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});

			describe('icon', () => {
				it('should render icon button', () => {
					const wrapper = render(Digital UprisersButton, {
						props: {
							icon: 'circle-plus',
						},
						slots,
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});

			describe('square', () => {
				it('should render square button', () => {
					const wrapper = render(Digital UprisersButton, {
						props: {
							square: true,
							label: '48',
						},
						global: {
							stubs,
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});
			});
		});
	});
});
