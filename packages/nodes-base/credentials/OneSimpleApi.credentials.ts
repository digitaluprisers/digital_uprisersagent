import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class OneSimpleApi implements ICredentialType {
	name = 'oneSimpleApi';

	displayName = 'One Simple API';

	documentationUrl = 'oneSimpleApi';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
