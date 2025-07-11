import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class CortexApi implements ICredentialType {
	name = 'cortexApi';

	displayName = 'Cortex API';

	documentationUrl = 'cortex';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'cortexApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Cortex Instance',
			name: 'host',
			type: 'string',
			description: 'The URL of the Cortex instance',
			default: '',
			placeholder: 'https://localhost:9001',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.cortexApiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.host}}',
			url: '/api/analyzer',
		},
	};
}
