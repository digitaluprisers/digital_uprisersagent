import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class GetResponseApi implements ICredentialType {
	name = 'getResponseApi';

	displayName = 'GetResponse API';

	documentationUrl = 'getResponse';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Auth-Token': '=api-key {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.getresponse.com/v3',
			url: '/campaigns',
		},
	};
}
