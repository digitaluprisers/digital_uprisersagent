import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class LinkedInOAuth2Api implements ICredentialType {
	name = 'linkedInOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'LinkedIn OAuth2 API';

	documentationUrl = 'linkedIn';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Organization Support',
			name: 'organizationSupport',
			type: 'boolean',
			default: true,
			description: 'Whether to request permissions to post as an organization',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://www.linkedin.com/oauth/v2/authorization',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://www.linkedin.com/oauth/v2/accessToken',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default:
				'=w_member_social{{$self["organizationSupport"] === true ? ",w_organization_social": $self["legacy"] === true ? ",r_liteprofile,r_emailaddress" : ",profile,email,openid"}}',
			description:
				'Standard scopes for posting on behalf of a user or organization. See <a href="https://docs.microsoft.com/en-us/linkedin/marketing/getting-started#available-permissions"> this resource </a>.',
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
			default: 'body',
		},
		{
			displayName: 'Legacy',
			name: 'legacy',
			type: 'boolean',
			default: true,
			description: 'Whether to use the legacy API',
		},
	];
}
