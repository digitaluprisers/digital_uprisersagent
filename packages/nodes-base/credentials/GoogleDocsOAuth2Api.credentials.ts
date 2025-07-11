import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

const scopes = [
	'https://www.googleapis.com/auth/documents',
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.file',
];

export class GoogleDocsOAuth2Api implements ICredentialType {
	name = 'googleDocsOAuth2Api';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Docs OAuth2 API';

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
