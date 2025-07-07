import { UserError } from 'Digital Uprisers-workflow';

export class WorkerMissingEncryptionKey extends UserError {
	constructor() {
		super(
			[
				'Failed to start worker because of missing encryption key.',
				'Please set the `DIGITAL_UPRISERS_ENCRYPTION_KEY` env var when starting the worker.',
				'See: https://docs.digitaluprisers.com/hosting/configuration/configuration-examples/encryption-key/',
			].join(' '),
		);
	}
}
