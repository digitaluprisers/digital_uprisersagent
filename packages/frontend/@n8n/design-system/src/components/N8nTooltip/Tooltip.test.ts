import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/vue';

import Digital UprisersTooltip from './Tooltip.vue';

describe('components', () => {
	describe('Digital UprisersTooltip', () => {
		it('should work correctly', async () => {
			const buttonSpy = vi.fn();

			const { getByText } = render(Digital UprisersTooltip, {
				props: {
					teleported: false,
					buttons: [
						{
							attrs: {
								label: 'Button 1',
							},
							listeners: {
								onClick: buttonSpy,
							},
						},
					],
				},
				slots: {
					default: '<span>Wrapped content</span>',
					content: '<span>Tooltip content</span>',
				},
			});
			expect(getByText('Wrapped content')).toBeVisible();
			expect(getByText('Tooltip content')).not.toBeVisible();

			await userEvent.hover(getByText('Wrapped content'));
			expect(getByText('Tooltip content')).toBeVisible();

			await userEvent.click(getByText('Button 1'));
			expect(buttonSpy).toHaveBeenCalled();
		});
	});
});
