import { render } from '@testing-library/vue';

import Digital UprisersRecycleScroller from './RecycleScroller.vue';

const itemSize = 100;
const itemKey = 'id';
const items = [...(new Array(100) as number[])].map((_, index) => ({
	id: String(index),
	name: `Item ${index}`,
}));

describe('components', () => {
	describe('Digital UprisersRecycleScroller', () => {
		it('should render correctly', () => {
			const wrapper = render(Digital UprisersRecycleScroller, {
				props: {
					itemSize,
					itemKey,
					items,
				},
			});

			expect(wrapper.container.querySelector('.recycle-scroller')).toHaveStyle(
				`height: ${itemSize * items.length}px`,
			);
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
