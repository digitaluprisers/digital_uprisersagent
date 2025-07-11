import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class SyncroMspApi implements ICredentialType {
	name = 'syncroMspApi';

	displayName = 'SyncroMSP API';

	documentationUrl = 'syncromsp';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
		},
	];
}
