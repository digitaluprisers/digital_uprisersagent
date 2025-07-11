import type { Mock, MockInstance } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { waitFor } from '@testing-library/vue';
import type { ExecutionSummary } from 'Digital Uprisers-workflow';
import { createComponentRenderer } from '@/__tests__/render';
import type { INodeUi, IWorkflowDb } from '@/Interface';
import WorkflowPreview from '@/components/WorkflowPreview.vue';
import { useExecutionsStore } from '@/stores/executions.store';

const renderComponent = createComponentRenderer(WorkflowPreview);

let pinia: ReturnType<typeof createPinia>;
let executionsStore: ReturnType<typeof useExecutionsStore>;
let postMessageSpy: Mock;
let focusSpy: Mock;
let consoleErrorSpy: MockInstance;

const sendPostMessageCommand = (command: string) => {
	window.postMessage(`{"command":"${command}"}`, '*');
};

describe('WorkflowPreview', () => {
	beforeEach(() => {
		pinia = createPinia();
		setActivePinia(pinia);
		executionsStore = useExecutionsStore();

		consoleErrorSpy = vi.spyOn(console, 'error');
		postMessageSpy = vi.fn();
		focusSpy = vi.fn();
		Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
			writable: true,
			value: {
				postMessage: postMessageSpy,
				focus: focusSpy,
			},
		});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it('should not call iframe postMessage when it is ready and no workflow or executionId props', async () => {
		renderComponent({
			pinia,
			props: {},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).not.toHaveBeenCalled();
		});
	});

	it('should not call iframe postMessage when it is ready and there are no nodes in the workflow', async () => {
		const workflow = {} as IWorkflowDb;
		renderComponent({
			pinia,
			props: {
				workflow,
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).not.toHaveBeenCalled();
		});
	});

	it('should not call iframe postMessage when it is ready and nodes is not an array', async () => {
		const workflow = { nodes: {} } as IWorkflowDb;
		renderComponent({
			pinia,
			props: {
				workflow,
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).not.toHaveBeenCalled();
		});
	});

	it('should call iframe postMessage with "openWorkflow" when it is ready and the workflow has nodes', async () => {
		const nodes = [{ name: 'Start' }] as INodeUi[];
		const workflow = { nodes } as IWorkflowDb;
		renderComponent({
			pinia,
			props: {
				workflow,
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'openWorkflow',
					workflow,
					canOpenNDV: true,
					hideNodeIssues: false,
				}),
				'*',
			);
			expect(focusSpy).toHaveBeenCalled();
		});
	});

	it('should not call iframe postMessage with "openExecution" when executionId is passed but mode not set to "execution"', async () => {
		const executionId = '123';
		renderComponent({
			pinia,
			props: {
				executionId,
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).not.toHaveBeenCalled();
		});
	});

	it('should call iframe postMessage with "openExecution" when executionId is passed and mode is set', async () => {
		const executionId = '123';
		renderComponent({
			pinia,
			props: {
				executionId,
				mode: 'execution',
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'openExecution',
					executionId,
					executionMode: '',
					canOpenNDV: true,
				}),
				'*',
			);
		});
	});

	it('should call also iframe postMessage with "setActiveExecution" if active execution is set', async () => {
		vi.spyOn(executionsStore, 'activeExecution', 'get').mockReturnValue({
			id: 'abc',
		} as ExecutionSummary);

		const executionId = '123';
		renderComponent({
			pinia,
			props: {
				executionId,
				mode: 'execution',
			},
		});

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'openExecution',
					executionId,
					executionMode: '',
					canOpenNDV: true,
				}),
				'*',
			);

			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'setActiveExecution',
					executionId: 'abc',
				}),
				'*',
			);
		});
	});

	it('iframe should toggle "openNDV" class with postmessages', async () => {
		const nodes = [{ name: 'Start' }] as INodeUi[];
		const workflow = { nodes } as IWorkflowDb;
		const { container } = renderComponent({
			pinia,
			props: {
				workflow,
			},
		});

		const iframe = container.querySelector('iframe');

		expect(iframe?.classList.toString()).not.toContain('openNDV');

		sendPostMessageCommand('Digital UprisersReady');

		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'openWorkflow',
					workflow,
					canOpenNDV: true,
					hideNodeIssues: false,
				}),
				'*',
			);
		});

		sendPostMessageCommand('openNDV');

		await waitFor(() => {
			expect(iframe?.classList.toString()).toContain('openNDV');
		});

		sendPostMessageCommand('closeNDV');

		await waitFor(() => {
			expect(iframe?.classList.toString()).not.toContain('openNDV');
		});
	});

	it('should pass the "Disable NDV" & "Hide issues" flags to using PostMessage', async () => {
		const nodes = [{ name: 'Start' }] as INodeUi[];
		const workflow = { nodes } as IWorkflowDb;
		renderComponent({
			pinia,
			props: {
				workflow,
				canOpenNDV: false,
			},
		});
		sendPostMessageCommand('Digital UprisersReady');
		await waitFor(() => {
			expect(postMessageSpy).toHaveBeenCalledWith(
				JSON.stringify({
					command: 'openWorkflow',
					workflow,
					canOpenNDV: false,
					hideNodeIssues: false,
				}),
				'*',
			);
		});
	});

	it('should emit "close" event if iframe sends "error" command', async () => {
		const { emitted } = renderComponent({
			pinia,
			props: {},
		});

		sendPostMessageCommand('error');

		await waitFor(() => {
			expect(emitted().close).toBeDefined();
		});
	});

	it('should not do anything if no "command" is sent in the message', async () => {
		const { emitted } = renderComponent({
			pinia,
			props: {},
		});

		window.postMessage('commando', '*');

		await waitFor(() => {
			expect(console.error).not.toHaveBeenCalled();
			expect(emitted()).toEqual({});
		});
	});

	it('should not do anything if no "command" is sent in the message and the `includes` method cannot be applied to the data', async () => {
		const { emitted } = renderComponent({
			pinia,
			props: {},
		});

		window.postMessage(null, '*');

		await waitFor(() => {
			expect(console.error).not.toHaveBeenCalled();
			expect(emitted()).toEqual({});
		});
	});
});
