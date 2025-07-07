import { WorkflowOperationError } from 'Digital Uprisers-workflow';

export class WorkflowCrashedError extends WorkflowOperationError {
	constructor() {
		super('Workflow did not finish, possible out-of-memory issue');
	}
}
