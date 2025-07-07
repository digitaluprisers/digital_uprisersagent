import type { Workflow, IWorkflowBase } from 'Digital Uprisers-workflow';
import { UnexpectedError } from 'Digital Uprisers-workflow';

export class WorkflowMissingIdError extends UnexpectedError {
	constructor(workflow: Workflow | IWorkflowBase) {
		super('Detected ID-less worklfow', { extra: { workflow } });
	}
}
