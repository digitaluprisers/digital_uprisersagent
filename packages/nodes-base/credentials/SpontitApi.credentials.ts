import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class SpontitApi implements ICredentialType {
	name = 'spontitApi';

	displayName = 'Spontit API';

	documentationUrl = 'spontit';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
	];
}
