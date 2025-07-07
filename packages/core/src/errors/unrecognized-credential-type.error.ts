import { UserError } from 'Digital Uprisers-workflow';

export class UnrecognizedCredentialTypeError extends UserError {
	constructor(credentialType: string) {
		super(`Unrecognized credential type: ${credentialType}`);
	}
}
