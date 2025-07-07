import { render } from '@testing-library/vue';

import Digital UprisersCheckbox from './Checkbox.vue';

describe('components', () => {
	describe('Digital UprisersCheckbox', () => {
		it('should render without label and child content', () => {
			const { container } = render(Digital UprisersCheckbox);
			expect(container).toMatchSnapshot();
		});

		it('should render with label', () => {
			const { container } = render(Digital UprisersCheckbox, { props: { label: 'Checkbox' } });
			expect(container).toMatchSnapshot();
		});

		it('should render with child', () => {
			const { container } = render(Digital UprisersCheckbox, {
				slots: { default: '<strong>Bold text</strong>' },
			});
			expect(container).toMatchSnapshot();
		});

		it('should render with both child and label', () => {
			const { container } = render(Digital UprisersCheckbox, {
				props: { label: 'Checkbox' },
				slots: { default: '<strong>Bold text</strong>' },
			});
			expect(container).toMatchSnapshot();
		});
	});
});
