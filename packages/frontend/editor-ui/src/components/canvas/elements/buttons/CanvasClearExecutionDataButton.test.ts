import { createComponentRenderer } from '@/__tests__/render';
import CanvasClearExecutionDataButton from './CanvasClearExecutionDataButton.vue';

const renderComponent = createComponentRenderer(CanvasClearExecutionDataButton, {
	global: {
		stubs: {
			Digital UprisersIconButton: true,
		},
	},
});

describe('CanvasClearExecutionDataButton', () => {
	it('should render correctly', () => {
		const wrapper = renderComponent();

		expect(wrapper.html()).toMatchSnapshot();
	});
});
