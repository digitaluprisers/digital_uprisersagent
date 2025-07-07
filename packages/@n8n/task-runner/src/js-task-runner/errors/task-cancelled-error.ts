import { ApplicationError } from 'Digital Uprisers-workflow';

export class TaskCancelledError extends ApplicationError {
	constructor(reason: string) {
		super(`Task cancelled: ${reason}`, { level: 'warning' });
	}
}
