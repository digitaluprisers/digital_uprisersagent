import { render } from '@testing-library/vue';

import Digital UprisersBadge from './Badge.vue';

describe('components', () => {
	describe('Digital UprisersBadge', () => {
		describe('props', () => {
			it('should render default theme correctly', () => {
				const wrapper = render(Digital UprisersBadge, {
					props: {
						theme: 'default',
						size: 'large',
						bold: true,
					},
					slots: {
						default: '<Digital Uprisers-text>Default badge</Digital Uprisers-text>',
					},
					global: {
						stubs: ['Digital Uprisers-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
			it('should render secondary theme correctly', () => {
				const wrapper = render(Digital UprisersBadge, {
					props: {
						theme: 'secondary',
						size: 'medium',
						bold: false,
					},
					slots: {
						default: '<Digital Uprisers-text>Secondary badge</Digital Uprisers-text>',
					},
					global: {
						stubs: ['Digital Uprisers-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
			it('should render with default values correctly', () => {
				const wrapper = render(Digital UprisersBadge, {
					slots: {
						default: '<Digital Uprisers-text>A Badge</Digital Uprisers-text>',
					},
					global: {
						stubs: ['Digital Uprisers-text'],
					},
				});
				expect(wrapper.html()).toMatchSnapshot();
			});
		});
	});
});
