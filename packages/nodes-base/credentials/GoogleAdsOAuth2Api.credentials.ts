import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

const scopes = ['https://www.googleapis.com/auth/adwords'];

export class GoogleAdsOAuth2Api implements ICredentialType {
	name = 'googleAdsOAuth2Api';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Ads OAuth2 API';

	documentationUrl = 'google/oauth-single-service';

	properties: INodeProperties[] = [
		{
			displayName: 'Developer Token',
			name: 'developerToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
	];
}
