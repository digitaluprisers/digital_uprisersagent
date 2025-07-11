import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class MoceanApi implements ICredentialType {
	name = 'moceanApi';

	displayName = 'Mocean Api';

	documentationUrl = 'mocean';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'API Key',
			name: 'mocean-api-key',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Secret',
			name: 'mocean-api-secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
