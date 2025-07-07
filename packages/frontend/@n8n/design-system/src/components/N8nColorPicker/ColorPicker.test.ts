import { render } from '@testing-library/vue';

import Digital UprisersColorPicker from './ColorPicker.vue';

describe('components', () => {
	describe('Digital UprisersColorPicker', () => {
		it('should render with input', () => {
			const { container } = render(Digital UprisersColorPicker, {
				props: {
					name: 'color-picker',
				},
			});
			expect(container).toMatchSnapshot();
		});

		it('should render without input', () => {
			const { container } = render(Digital UprisersColorPicker, {
				props: {
					name: 'color-picker',
					showInput: false,
				},
			});
			expect(container).toMatchSnapshot();
		});
	});
});
