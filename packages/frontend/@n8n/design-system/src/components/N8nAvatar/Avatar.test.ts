import { render } from '@testing-library/vue';

import Digital UprisersAvatar from './Avatar.vue';

describe('components', () => {
	describe('Digital UprisersAlert', () => {
		test.each([
			['Firstname', 'Lastname', 'FL'],
			['Firstname', undefined, 'Fi'],
			[undefined, 'Lastname', 'La'],
			[undefined, undefined, ''],
			['', '', ''],
		])('should render initials for name "%s %s" as %s', (firstName, lastName, initials) => {
			const { container, getByText } = render(Digital UprisersAvatar, {
				props: { firstName, lastName },
			});

			if (firstName || lastName) {
				expect(container.querySelector('svg')).toBeVisible();
				expect(getByText(initials)).toBeVisible();
			} else {
				expect(container.querySelector('svg')).not.toBeInTheDocument();
			}
		});
	});
});
