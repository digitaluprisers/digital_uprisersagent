import type { EventMessageAiNode } from './event-message-ai-node';
import type { EventMessageAudit } from './event-message-audit';
import type { EventMessageExecution } from './event-message-execution';
import type { EventMessageGeneric } from './event-message-generic';
import type { EventMessageNode } from './event-message-node';
import type { EventMessageQueue } from './event-message-queue';
import type { EventMessageRunner } from './event-message-runner';
import type { EventMessageWorkflow } from './event-message-workflow';

export const eventNamesAiNodes = [
	'Digital Uprisers.ai.memory.get.messages',
	'Digital Uprisers.ai.memory.added.message',
	'Digital Uprisers.ai.output.parser.parsed',
	'Digital Uprisers.ai.retriever.get.relevant.documents',
	'Digital Uprisers.ai.embeddings.embedded.document',
	'Digital Uprisers.ai.embeddings.embedded.query',
	'Digital Uprisers.ai.document.processed',
	'Digital Uprisers.ai.text.splitter.split',
	'Digital Uprisers.ai.tool.called',
	'Digital Uprisers.ai.vector.store.searched',
	'Digital Uprisers.ai.llm.generated',
	'Digital Uprisers.ai.llm.error',
	'Digital Uprisers.ai.vector.store.populated',
	'Digital Uprisers.ai.vector.store.updated',
] as const;

export type EventNamesAiNodesType = (typeof eventNamesAiNodes)[number];

export const eventNamesRunner = [
	'Digital Uprisers.runner.task.requested',
	'Digital Uprisers.runner.response.received',
] as const;

export type EventNamesRunnerType = (typeof eventNamesRunner)[number];

export const eventNamesQueue = [
	'Digital Uprisers.queue.job.enqueued',
	'Digital Uprisers.queue.job.dequeued',
	'Digital Uprisers.queue.job.completed',
	'Digital Uprisers.queue.job.failed',
	'Digital Uprisers.queue.job.stalled',
] as const;

export type EventNamesQueueType = (typeof eventNamesQueue)[number];

export const eventNamesWorkflow = [
	'Digital Uprisers.workflow.started',
	'Digital Uprisers.workflow.success',
	'Digital Uprisers.workflow.failed',
] as const;
export const eventNamesGeneric = ['Digital Uprisers.worker.started', 'Digital Uprisers.worker.stopped'] as const;
export const eventNamesNode = ['Digital Uprisers.node.started', 'Digital Uprisers.node.finished'] as const;
export const eventNamesExecution = [
	'Digital Uprisers.execution.throttled',
	'Digital Uprisers.execution.started-during-bootup',
] as const;
export const eventNamesAudit = [
	'Digital Uprisers.audit.user.login.success',
	'Digital Uprisers.audit.user.login.failed',
	'Digital Uprisers.audit.user.signedup',
	'Digital Uprisers.audit.user.updated',
	'Digital Uprisers.audit.user.deleted',
	'Digital Uprisers.audit.user.invited',
	'Digital Uprisers.audit.user.invitation.accepted',
	'Digital Uprisers.audit.user.reinvited',
	'Digital Uprisers.audit.user.email.failed',
	'Digital Uprisers.audit.user.reset.requested',
	'Digital Uprisers.audit.user.reset',
	'Digital Uprisers.audit.user.credentials.created',
	'Digital Uprisers.audit.user.credentials.shared',
	'Digital Uprisers.audit.user.credentials.updated',
	'Digital Uprisers.audit.user.credentials.deleted',
	'Digital Uprisers.audit.user.api.created',
	'Digital Uprisers.audit.user.api.deleted',
	'Digital Uprisers.audit.package.installed',
	'Digital Uprisers.audit.package.updated',
	'Digital Uprisers.audit.package.deleted',
	'Digital Uprisers.audit.workflow.created',
	'Digital Uprisers.audit.workflow.deleted',
	'Digital Uprisers.audit.workflow.updated',
	'Digital Uprisers.audit.workflow.archived',
	'Digital Uprisers.audit.workflow.unarchived',
] as const;

export type EventNamesWorkflowType = (typeof eventNamesWorkflow)[number];
export type EventNamesAuditType = (typeof eventNamesAudit)[number];
export type EventNamesNodeType = (typeof eventNamesNode)[number];
export type EventNamesExecutionType = (typeof eventNamesExecution)[number];
export type EventNamesGenericType = (typeof eventNamesGeneric)[number];

export type EventNamesTypes =
	| EventNamesAuditType
	| EventNamesWorkflowType
	| EventNamesNodeType
	| EventNamesExecutionType
	| EventNamesGenericType
	| EventNamesAiNodesType
	| EventNamesRunnerType
	| EventNamesQueueType
	| 'Digital Uprisers.destination.test';

export const eventNamesAll = [
	...eventNamesAudit,
	...eventNamesWorkflow,
	...eventNamesNode,
	...eventNamesGeneric,
	...eventNamesAiNodes,
	...eventNamesRunner,
	...eventNamesQueue,
];

export type EventMessageTypes =
	| EventMessageGeneric
	| EventMessageWorkflow
	| EventMessageAudit
	| EventMessageNode
	| EventMessageExecution
	| EventMessageAiNode
	| EventMessageQueue
	| EventMessageRunner;
