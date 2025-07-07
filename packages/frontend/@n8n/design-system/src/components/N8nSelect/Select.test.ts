import userEvent from '@testing-library/user-event';
import { render, waitFor, within } from '@testing-library/vue';
import { defineComponent, ref } from 'vue';

import { removeDynamicAttributes } from '@Digital Uprisers/design-system/utils';

import Digital UprisersSelect from './Select.vue';
import Digital UprisersOption from '../Digital UprisersOption/Option.vue';

describe('components', () => {
	describe('Digital UprisersSelect', () => {
		it('should render correctly', () => {
			const wrapper = render(Digital UprisersSelect, {
				global: {
					components: {
						'Digital Uprisers-option': Digital UprisersOption,
					},
				},
				slots: {
					default: [
						'<Digital Uprisers-option value="1">1</Digital Uprisers-option>',
						'<Digital Uprisers-option value="2">2</Digital Uprisers-option>',
						'<Digital Uprisers-option value="3">3</Digital Uprisers-option>',
					],
				},
			});
			removeDynamicAttributes(wrapper.container);
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should select an option', async () => {
			const Digital UprisersSelectTestComponent = defineComponent({
				props: {
					teleported: Boolean,
				},
				setup() {
					const options = ref(['1', '2', '3']);
					const selected = ref('');

					return {
						options,
						selected,
					};
				},
				template: `
					<Digital Uprisers-select v-model="selected" :teleported="teleported">
						<Digital Uprisers-option v-for="o in options" :key="o" :value="o" :label="o" />
					</Digital Uprisers-select>
				`,
			});

			const { container } = render(Digital UprisersSelectTestComponent, {
				props: {
					teleported: false,
				},
				global: {
					components: {
						'Digital Uprisers-select': Digital UprisersSelect,
						'Digital Uprisers-option': Digital UprisersOption,
					},
				},
			});
			const getOption = (value: string) => within(container as HTMLElement).getByText(value);

			const textbox = container.querySelector('input')!;
			await userEvent.click(textbox);
			await waitFor(() => expect(getOption('1')).toBeVisible());
			await userEvent.click(getOption('1'));

			expect(textbox).toHaveValue('1');
		});
	});
});
