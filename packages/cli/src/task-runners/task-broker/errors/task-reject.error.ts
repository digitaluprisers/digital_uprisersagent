import { UserError } from 'Digital Uprisers-workflow';

export class TaskRejectError extends UserError {
	constructor(public reason: string) {
		super(`Task rejected with reason: ${reason}`);
	}
}
