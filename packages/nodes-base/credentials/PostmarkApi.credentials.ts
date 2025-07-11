import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class PostmarkApi implements ICredentialType {
	name = 'postmarkApi';

	displayName = 'Postmark API';

	documentationUrl = 'postmark';

	properties: INodeProperties[] = [
		{
			displayName: 'Server API Token',
			name: 'serverToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Postmark-Server-Token': '={{$credentials.serverToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.postmarkapp.com',
			url: '/server',
			method: 'GET',
		},
	};
}
