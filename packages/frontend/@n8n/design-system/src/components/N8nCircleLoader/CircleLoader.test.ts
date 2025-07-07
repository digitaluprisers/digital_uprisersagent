import { render } from '@testing-library/vue';

import Digital UprisersCircleLoader from './CircleLoader.vue';

describe('Digital UprisersCircleLoader', () => {
	it('should render correctly', () => {
		const wrapper = render(Digital UprisersCircleLoader, {
			props: {
				radius: 20,
				progress: 42,
				strokeWidth: 10,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
