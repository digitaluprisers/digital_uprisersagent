import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class LingvaNexApi implements ICredentialType {
	name = 'lingvaNexApi';

	displayName = 'LingvaNex API';

	documentationUrl = 'lingvaNex';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
