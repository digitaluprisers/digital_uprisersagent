import { UserError } from 'Digital Uprisers-workflow';

export class InvalidSamlMetadataUrlError extends UserError {
	constructor(url: string) {
		super(`Failed to produce valid SAML metadata from ${url}`);
	}
}
