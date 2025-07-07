import { UnexpectedError } from 'Digital Uprisers-workflow';

export class DeduplicationError extends UnexpectedError {
	constructor(message: string) {
		super(`Deduplication Failed: ${message}`);
	}
}
