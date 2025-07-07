import { UserError } from 'Digital Uprisers-workflow';

export class CredentialsOverwritesAlreadySetError extends UserError {
	constructor() {
		super('Credentials overwrites may not be set more than once.');
	}
}
