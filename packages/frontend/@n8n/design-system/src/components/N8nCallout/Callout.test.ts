import { render } from '@testing-library/vue';

import Digital UprisersCallout from './Callout.vue';

describe('components', () => {
	describe('Digital UprisersCallout', () => {
		it('should render info theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'info',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is an info callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render success theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'success',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a success callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render warning theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'warning',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a warning callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render danger theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'danger',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a danger callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render secondary theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'secondary',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a secondary callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render custom theme correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a secondary callout.</Digital Uprisers-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render additional slots correctly', () => {
			const wrapper = render(Digital UprisersCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['Digital Uprisers-icon', 'Digital Uprisers-text', 'Digital Uprisers-link'],
				},
				slots: {
					default: '<Digital Uprisers-text size="small">This is a secondary callout.</Digital Uprisers-text>',
					actions: '<Digital Uprisers-link size="small">Do something!</Digital Uprisers-link>',
					trailingContent:
						'<Digital Uprisers-link theme="secondary" size="small" :bold="true" :underline="true" to="https://digitaluprisers.com">Learn more</Digital Uprisers-link>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
