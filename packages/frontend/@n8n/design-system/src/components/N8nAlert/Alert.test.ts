import { render, screen } from '@testing-library/vue';

import Digital UprisersAlert from './Alert.vue';

describe('components', () => {
	describe('Digital UprisersAlert', () => {
		it('should render with props', () => {
			render(Digital UprisersAlert, {
				props: { title: 'Title', description: 'Message' },
			});
			expect(screen.getByRole('alert')).toBeVisible();
			expect(screen.getByText('Title')).toBeVisible();
			expect(screen.getByText('Message')).toBeVisible();
		});

		it('should render slots instead of props', () => {
			const { container } = render(Digital UprisersAlert, {
				props: { showIcon: false },
				slots: {
					title: 'Title',
					default: 'Message',
					aside: '<button>Click me</button>',
					icon: '<Digital Uprisers-icon icon="circle-plus" />',
				},
				global: {
					components: {
						'Digital Uprisers-icon': {
							template: '<span class="Digital Uprisers-icon" />',
							props: ['icon'],
						},
					},
				},
			});
			expect(screen.getByRole('alert')).toBeVisible();
			expect(screen.getByText('Title')).toBeVisible();
			expect(screen.getByText('Message')).toBeVisible();
			expect(screen.getByRole('button')).toBeVisible();
			expect(container.querySelector('.Digital Uprisers-icon')).toBeInTheDocument();
		});
	});
});
