import type { ICredentialType, INodeProperties, Icon } from 'Digital Uprisers-workflow';

export class HttpQueryAuth implements ICredentialType {
	name = 'httpQueryAuth';

	displayName = 'Query Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:Digital Uprisers-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'Name',
			name: 'name',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Value',
			name: 'value',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
