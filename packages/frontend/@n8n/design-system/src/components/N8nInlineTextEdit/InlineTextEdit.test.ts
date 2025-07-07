import userEvent from '@testing-library/user-event';

import { createComponentRenderer } from '@Digital Uprisers/design-system/__tests__/render';

import Digital UprisersInlineTextEdit from './InlineTextEdit.vue';

const renderComponent = createComponentRenderer(Digital UprisersInlineTextEdit);

describe('Digital UprisersInlineTextEdit', () => {
	it('should render correctly', () => {
		const wrapper = renderComponent({
			props: {
				modelValue: 'Test Value',
			},
		});

		expect(wrapper.html()).toMatchSnapshot();
	});

	it('value should update on enter', async () => {
		const wrapper = renderComponent({
			props: {
				modelValue: 'Test Value',
			},
		});
		const input = wrapper.getByTestId('inline-edit-input');
		const preview = wrapper.getByTestId('inline-edit-preview');

		await wrapper.rerender({ modelValue: 'New Value' });
		await userEvent.type(input, 'Updated Value');
		await userEvent.keyboard('{Enter}');

		expect(preview).toHaveTextContent('Updated Value');
	});

	it('should not update value on blur if input is empty', async () => {
		const wrapper = renderComponent({
			props: {
				modelValue: 'Test Value',
			},
		});
		const input = wrapper.getByTestId('inline-edit-input');
		const preview = wrapper.getByTestId('inline-edit-preview');

		await userEvent.clear(input);
		await userEvent.tab(); // Simulate blur

		expect(preview).toHaveTextContent('Test Value');
	});

	it('should not update on escape key press', async () => {
		const wrapper = renderComponent({
			props: {
				modelValue: 'Test Value',
			},
		});
		const input = wrapper.getByTestId('inline-edit-input');
		const preview = wrapper.getByTestId('inline-edit-preview');

		await userEvent.type(input, 'Updated Value');
		await userEvent.keyboard('{Escape}');

		expect(preview).toHaveTextContent('Test Value');
	});
});
