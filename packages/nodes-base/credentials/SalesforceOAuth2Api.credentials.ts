import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class SalesforceOAuth2Api implements ICredentialType {
	name = 'salesforceOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Salesforce OAuth2 API';

	documentationUrl = 'salesforce';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Environment Type',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'production',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			required: true,
			default:
				'={{ $self["environment"] === "sandbox" ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize" }}',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			required: true,
			default:
				'={{ $self["environment"] === "sandbox" ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token" }}',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'full refresh_token',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
