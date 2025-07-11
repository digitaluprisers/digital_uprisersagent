import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class DhlApi implements ICredentialType {
	name = 'dhlApi';

	displayName = 'DHL API';

	documentationUrl = 'dhl';

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
