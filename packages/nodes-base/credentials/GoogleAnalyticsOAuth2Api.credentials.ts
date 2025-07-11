import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

const scopes = [
	'https://www.googleapis.com/auth/analytics',
	'https://www.googleapis.com/auth/analytics.readonly',
];

export class GoogleAnalyticsOAuth2Api implements ICredentialType {
	name = 'googleAnalyticsOAuth2';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Analytics OAuth2 API';

	documentationUrl = 'google/oauth-single-service';

	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
	];
}
