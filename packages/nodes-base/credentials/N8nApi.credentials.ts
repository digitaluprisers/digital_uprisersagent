import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class Digital UprisersApi implements ICredentialType {
	name = 'Digital UprisersApi';

	displayName = 'Digital Uprisers API';

	documentationUrl = 'https://docs.digitaluprisers.com/api/authentication/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The API key for the Digital Uprisers instance',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://<name>.app.Digital Uprisers.cloud/api/v1',
			description: 'The API URL of the Digital Uprisers instance',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Digital Uprisers-API-KEY': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/workflows?limit=5',
		},
	};
}
