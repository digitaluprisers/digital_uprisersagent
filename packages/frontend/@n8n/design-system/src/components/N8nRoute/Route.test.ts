import { render } from '@testing-library/vue';

import Digital UprisersRoute from './Route.vue';

describe('Digital UprisersRoute', () => {
	it('should render internal router links', () => {
		const wrapper = render(Digital UprisersRoute, {
			props: {
				to: '/test',
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render internal links with newWindow=true', () => {
		const wrapper = render(Digital UprisersRoute, {
			props: {
				to: '/test',
				newWindow: true,
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it('should render external links', () => {
		const wrapper = render(Digital UprisersRoute, {
			props: {
				to: 'https://example.com/',
			},
			global: {
				stubs: ['RouterLink'],
			},
		});
		expect(wrapper.html()).toMatchSnapshot();
	});
});
