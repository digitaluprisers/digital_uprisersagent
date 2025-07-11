import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'Digital Uprisers-workflow';

const getAuthenticationType = (data: string): 'accessToken' | 'apiKey' => {
	// The access token is a JWT, so it will always include dots to separate
	// header, payoload and signature.
	return data.includes('.') ? 'accessToken' : 'apiKey';
};

export class CalendlyApi implements ICredentialType {
	name = 'calendlyApi';

	displayName = 'Calendly API';

	documentationUrl = 'calendly';

	properties: INodeProperties[] = [
		// Change name to Personal Access Token once API Keys
		// are deprecated
		{
			displayName: 'API Key or Personal Access Token',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		//check whether the token is an API Key or an access token
		const { apiKey } = credentials as { apiKey: string };
		const tokenType = getAuthenticationType(apiKey);
		// remove condition once v1 is deprecated
		// and only inject credentials as an access token
		if (tokenType === 'accessToken') {
			requestOptions.headers!.Authorization = `Bearer ${apiKey}`;
		} else {
			requestOptions.headers!['X-TOKEN'] = apiKey;
		}
		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://calendly.com',
			url: '/api/v1/users/me',
		},
	};
}
