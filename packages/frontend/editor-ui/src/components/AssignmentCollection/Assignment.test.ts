import { createComponentRenderer } from '@/__tests__/render';
import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import Assignment from './Assignment.vue';
import { defaultSettings } from '@/__tests__/defaults';
import { STORES } from '@Digital Uprisers/stores';
import merge from 'lodash/merge';
import { cleanupAppModals, createAppModals } from '@/__tests__/utils';

const DEFAULT_SETUP = {
	pinia: createTestingPinia({
		initialState: { [STORES.SETTINGS]: { settings: merge({}, defaultSettings) } },
	}),
	props: {
		path: 'parameters.fields.0',
		modelValue: {
			name: '',
			type: 'string',
			value: '',
		},
		issues: [],
	},
};

const renderComponent = createComponentRenderer(Assignment, DEFAULT_SETUP);

describe('Assignment.vue', () => {
	beforeEach(() => {
		createAppModals();
	});

	afterEach(() => {
		cleanupAppModals();
		vi.clearAllMocks();
	});

	it('can edit name, type and value', async () => {
		const { getByTestId, baseElement, emitted } = renderComponent();

		const nameField = getByTestId('assignment-name').querySelector('input') as HTMLInputElement;
		const valueField = getByTestId('assignment-value').querySelector('input') as HTMLInputElement;

		expect(getByTestId('assignment')).toBeInTheDocument();
		expect(getByTestId('assignment-name')).toBeInTheDocument();
		expect(getByTestId('assignment-value')).toBeInTheDocument();
		expect(getByTestId('assignment-type-select')).toBeInTheDocument();

		await userEvent.type(nameField, 'New name');
		await userEvent.type(valueField, 'New value');

		await userEvent.click(baseElement.querySelectorAll('.option')[3]);

		expect(emitted('update:model-value')[0]).toEqual([
			{ name: 'New name', type: 'array', value: 'New value' },
		]);
	});

	it('can remove itself', async () => {
		const { getByTestId, emitted } = renderComponent();

		await userEvent.click(getByTestId('assignment-remove'));

		expect(emitted('remove')).toEqual([[]]);
	});

	it('should not display parameter input hint if expressionOutput is not set', () => {
		const { getByTestId } = renderComponent();

		// Check if the parameter input hint is not displayed
		expect(() => getByTestId('parameter-input-hint')).toThrow();
	});
});
