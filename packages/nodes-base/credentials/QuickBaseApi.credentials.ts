import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class QuickBaseApi implements ICredentialType {
	name = 'quickbaseApi';

	displayName = 'Quick Base API';

	documentationUrl = 'quickbase';

	properties: INodeProperties[] = [
		{
			displayName: 'Hostname',
			name: 'hostname',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'demo.quickbase.com',
		},
		{
			displayName: 'User Token',
			name: 'userToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];
}
