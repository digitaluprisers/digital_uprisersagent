import { UserError } from 'Digital Uprisers-workflow';

export class TaskDeferredError extends UserError {
	constructor() {
		super('Task deferred until runner is ready');
	}
}
