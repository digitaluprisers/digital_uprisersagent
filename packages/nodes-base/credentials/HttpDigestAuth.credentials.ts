import type { ICredentialType, INodeProperties, Icon } from 'Digital Uprisers-workflow';

export class HttpDigestAuth implements ICredentialType {
	name = 'httpDigestAuth';

	displayName = 'Digest Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:Digital Uprisers-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
