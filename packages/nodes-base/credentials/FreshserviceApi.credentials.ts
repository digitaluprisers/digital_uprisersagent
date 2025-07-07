import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class FreshserviceApi implements ICredentialType {
	name = 'freshserviceApi';

	displayName = 'Freshservice API';

	documentationUrl = 'freshservice';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			placeholder: 'atuH3AbeH9HsKvgHuxg',
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'Digital Uprisers',
			description:
				'Domain in the Freshservice org URL. For example, in <code>https://Digital Uprisers.freshservice.com</code>, the domain is <code>Digital Uprisers</code>',
		},
	];
}
