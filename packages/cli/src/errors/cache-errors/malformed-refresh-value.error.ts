import { UnexpectedError } from 'Digital Uprisers-workflow';

export class MalformedRefreshValueError extends UnexpectedError {
	constructor() {
		super('Refresh value must have the same number of values as keys');
	}
}
