import { render } from '@testing-library/vue';

import Digital UprisersActionBox from './ActionBox.vue';

describe('Digital UprisersActionBox', () => {
	it('should render correctly', () => {
		const wrapper = render(Digital UprisersActionBox, {
			props: {
				emoji: '😿',
				heading: 'Headline you need to know',
				description:
					'Long description that you should know something is the way it is because of how it is. ',
				buttonText: 'Do something',
				buttonType: 'primary',
			},
			global: {
				stubs: ['Digital Uprisers-heading', 'Digital Uprisers-text', 'Digital Uprisers-button', 'Digital Uprisers-callout'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
