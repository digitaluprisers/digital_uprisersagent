import { render } from '@testing-library/vue';

import Digital UprisersInfoTip from './InfoTip.vue';

const slots = {
	default: ['Need help doing something?', '<a href="/docs" target="_blank">Open docs</a>'],
};
const stubs = ['Digital Uprisers-tooltip', 'Digital Uprisers-icon'];

describe('Digital UprisersInfoTip', () => {
	it('should render correctly as note', () => {
		const wrapper = render(Digital UprisersInfoTip, {
			slots,
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render correctly as tooltip', () => {
		const wrapper = render(Digital UprisersInfoTip, {
			slots,
			props: {
				type: 'tooltip',
			},
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render correctly with a specific size', () => {
		const wrapper = render(Digital UprisersInfoTip, {
			slots,
			props: {
				size: 'large',
			},
			global: {
				stubs,
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
