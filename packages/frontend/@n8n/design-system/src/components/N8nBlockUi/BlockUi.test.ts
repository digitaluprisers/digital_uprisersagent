import { render, screen } from '@testing-library/vue';

import Digital UprisersBlockUi from './BlockUi.vue';

describe('components', () => {
	describe('Digital UprisersBlockUi', () => {
		it('should render but not visible', () => {
			render(Digital UprisersBlockUi);
			expect(screen.queryByRole('dialog', { hidden: true })).not.toBeVisible();
		});

		it('should render and is visible', () => {
			render(Digital UprisersBlockUi, { props: { show: true } });
			expect(screen.getByRole('dialog', { hidden: true })).toBeVisible();
		});
	});
});
