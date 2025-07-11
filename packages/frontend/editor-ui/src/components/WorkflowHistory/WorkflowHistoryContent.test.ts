import { vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import type { UserAction } from '@Digital Uprisers/design-system';
import { createComponentRenderer } from '@/__tests__/render';
import WorkflowHistoryContent from '@/components/WorkflowHistory/WorkflowHistoryContent.vue';
import type { WorkflowHistoryActionTypes } from '@Digital Uprisers/rest-api-client/api/workflowHistory';
import { workflowVersionDataFactory } from '@/stores/__tests__/utils/workflowHistoryTestUtils';
import type { IWorkflowDb } from '@/Interface';
import type { IUser } from 'Digital Uprisers-workflow';

const actionTypes: WorkflowHistoryActionTypes = ['restore', 'clone', 'open', 'download'];
const actions: Array<UserAction<IUser>> = actionTypes.map((value) => ({
	label: value,
	disabled: false,
	value,
}));

const renderComponent = createComponentRenderer(WorkflowHistoryContent);

let pinia: ReturnType<typeof createPinia>;
let postMessageSpy: MockInstance;

describe('WorkflowHistoryContent', () => {
	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);

		postMessageSpy = vi.fn();
		Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
			writable: true,
			value: {
				postMessage: postMessageSpy,
			},
		});
	});

	it('should use the list item component to render version data', () => {
		const workflowVersion = workflowVersionDataFactory();
		const { getByTestId } = renderComponent({
			pinia,
			props: {
				workflow: null,
				workflowVersion,
				actions,
			},
		});

		expect(getByTestId('workflow-history-list-item')).toBeInTheDocument();
	});

	test.each(actionTypes)('should emit %s event', async (action) => {
		const workflowVersion = workflowVersionDataFactory();
		const { getByTestId, emitted } = renderComponent({
			pinia,
			props: {
				workflow: null,
				workflowVersion,
				actions,
			},
		});

		await userEvent.click(getByTestId('action-toggle-button'));
		expect(getByTestId('action-toggle-dropdown')).toBeInTheDocument();

		await userEvent.click(getByTestId(`action-${action}`));
		expect(emitted().action).toEqual([
			[{ action, id: workflowVersion.versionId, data: { formattedCreatedAt: expect.any(String) } }],
		]);
	});

	it('should pass proper workflow data to WorkflowPreview component', async () => {
		const workflowVersion = workflowVersionDataFactory();
		const workflow = { pinData: {} } as IWorkflowDb;
		renderComponent({
			pinia,
			props: {
				workflow,
				workflowVersion,
				actions,
			},
		});

		window.postMessage('{"command":"Digital UprisersReady"}', '*');

		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(expect.not.stringContaining('pinData'), '*');
		});
	});
});
