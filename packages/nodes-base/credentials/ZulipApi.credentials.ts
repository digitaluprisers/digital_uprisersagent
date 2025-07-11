import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class ZulipApi implements ICredentialType {
	name = 'zulipApi';

	displayName = 'Zulip API';

	documentationUrl = 'zulip';

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://yourZulipDomain.zulipchat.com',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			placeholder: 'name@email.com',
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
