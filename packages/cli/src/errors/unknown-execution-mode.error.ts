import { UnexpectedError } from 'Digital Uprisers-workflow';

export class UnknownExecutionModeError extends UnexpectedError {
	constructor(mode: string) {
		super('Unknown execution mode', { extra: { mode } });
	}
}
