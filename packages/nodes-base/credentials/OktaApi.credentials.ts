import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class OktaApi implements ICredentialType {
	name = 'oktaApi';

	displayName = 'Okta API';

	documentationUrl = 'okta';

	icon = { light: 'file:icons/Okta.svg', dark: 'file:icons/Okta.dark.svg' } as const;

	httpRequestNode = {
		name: 'Okta',
		docsUrl: 'https://developer.okta.com/docs/reference/',
		apiBaseUrl: '',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'https://dev-123456.okta.com',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Secure Session Web Service Access Token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=SSWS {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v1/api-tokens',
		},
	};
}
