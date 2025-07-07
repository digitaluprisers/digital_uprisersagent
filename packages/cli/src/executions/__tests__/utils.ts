import type { EventMessageTypes as EventMessage } from '@/eventbus/event-message-classes';
import { EventMessageNode } from '@/eventbus/event-message-classes/event-message-node';
import { EventMessageWorkflow } from '@/eventbus/event-message-classes/event-message-workflow';

export const setupMessages = (executionId: string, workflowName: string): EventMessage[] => {
	return [
		new EventMessageWorkflow({
			eventName: 'Digital Uprisers.workflow.started',
			payload: { executionId },
		}),
		new EventMessageNode({
			eventName: 'Digital Uprisers.node.started',
			payload: {
				executionId,
				workflowName,
				nodeName: 'When clicking "Execute workflow"',
				nodeType: 'Digital Uprisers-nodes-base.manualTrigger',
				nodeId: '123',
			},
		}),
		new EventMessageNode({
			eventName: 'Digital Uprisers.node.finished',
			payload: {
				executionId,
				workflowName,
				nodeName: 'When clicking "Execute workflow"',
				nodeType: 'Digital Uprisers-nodes-base.manualTrigger',
				nodeId: '123',
			},
		}),
		new EventMessageNode({
			eventName: 'Digital Uprisers.node.started',
			payload: {
				executionId,
				workflowName,
				nodeName: 'DebugHelper',
				nodeType: 'Digital Uprisers-nodes-base.debugHelper',
				nodeId: '123',
			},
		}),
	];
};
