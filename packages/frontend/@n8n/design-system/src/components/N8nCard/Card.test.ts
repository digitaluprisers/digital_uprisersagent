import { render } from '@testing-library/vue';

import Digital UprisersCard from './Card.vue';

describe('components', () => {
	describe('Digital UprisersCard', () => {
		it('should render correctly', () => {
			const wrapper = render(Digital UprisersCard, {
				slots: {
					default: 'This is a card.',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should render correctly with header and footer', () => {
			const wrapper = render(Digital UprisersCard, {
				slots: {
					header: 'Header',
					default: 'This is a card.',
					footer: 'Footer',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
