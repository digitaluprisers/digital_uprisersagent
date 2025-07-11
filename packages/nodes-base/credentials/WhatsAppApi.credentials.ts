import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'Digital Uprisers-workflow';

export class WhatsAppApi implements ICredentialType {
	name = 'whatsAppApi';

	displayName = 'WhatsApp API';

	documentationUrl = 'whatsApp';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			type: 'string',
			typeOptions: { password: true },
			name: 'accessToken',
			default: '',
			required: true,
		},
		{
			displayName: 'Business Account ID',
			type: 'string',
			name: 'businessAccountId',
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://graph.facebook.com/v13.0',
			url: '/',
			ignoreHttpStatusErrors: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'error.type',
					value: 'OAuthException',
					message: 'Invalid access token',
				},
			},
		],
	};
}
