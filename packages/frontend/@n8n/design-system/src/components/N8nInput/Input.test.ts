import { render } from '@testing-library/vue';

import Digital UprisersInput from './Input.vue';

describe('Digital UprisersInput', () => {
	it('should render correctly', () => {
		const wrapper = render(Digital UprisersInput, {
			props: {
				name: 'input',
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should add .ph-no-capture class on password input', () => {
		const { container } = render(Digital UprisersInput, {
			props: {
				type: 'password',
			},
		});
		expect(container.firstChild).toHaveClass('ph-no-capture');
	});

	it('should not add .ph-no-capture class on other input types', () => {
		const { container } = render(Digital UprisersInput, {
			props: {
				type: 'number',
			},
		});
		expect(container.firstChild).not.toHaveClass('ph-no-capture');
	});
});
