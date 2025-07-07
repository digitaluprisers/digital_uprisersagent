import { render } from '@testing-library/vue';

import { Digital UprisersText } from '@Digital Uprisers/design-system/components';
import { Digital UprisersHtml } from '@Digital Uprisers/design-system/directives';

import Digital UprisersNotice from './Notice.vue';

describe('components', () => {
	describe('Digital UprisersNotice', () => {
		it('should render correctly', () => {
			const wrapper = render(Digital UprisersNotice, {
				props: {
					id: 'notice',
				},
				slots: {
					default: 'This is a notice.',
				},
				global: {
					stubs: ['Digital Uprisers-text'],
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		describe('props', () => {
			describe('content', () => {
				it('should render correctly with content prop', () => {
					const wrapper = render(Digital UprisersNotice, {
						props: {
							id: 'notice',
							content: 'This is a notice.',
						},
						global: {
							stubs: ['Digital Uprisers-text'],
						},
					});
					expect(wrapper.html()).toMatchSnapshot();
				});

				it('should render HTML', () => {
					const wrapper = render(Digital UprisersNotice, {
						props: {
							id: 'notice',
							content: '<strong>Hello world!</strong> This is a notice.',
						},
						global: {
							directives: {
								Digital UprisersHtml,
							},
							components: {
								'Digital Uprisers-text': Digital UprisersText,
							},
						},
					});

					expect(wrapper.container.querySelectorAll('strong')).toHaveLength(1);
					expect(wrapper.html()).toMatchSnapshot();
				});

				it('should sanitize rendered HTML', () => {
					const wrapper = render(Digital UprisersNotice, {
						props: {
							id: 'notice',
							content: '<script>alert(1);</script> This is a notice.',
						},
						global: {
							stubs: ['Digital Uprisers-text'],
						},
					});

					expect(wrapper.container.querySelector('script')).not.toBeTruthy();
					expect(wrapper.html()).toMatchSnapshot();
				});
			});
		});
	});
});
