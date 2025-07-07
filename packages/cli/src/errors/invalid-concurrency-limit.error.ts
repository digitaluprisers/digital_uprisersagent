import { UserError } from 'Digital Uprisers-workflow';

export class InvalidConcurrencyLimitError extends UserError {
	constructor(value: number) {
		super('Concurrency limit set to invalid value', { extra: { value } });
	}
}
