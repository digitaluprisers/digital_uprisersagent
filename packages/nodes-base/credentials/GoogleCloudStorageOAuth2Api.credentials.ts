import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

const scopes = [
	'https://www.googleapis.com/auth/cloud-platform',
	'https://www.googleapis.com/auth/cloud-platform.read-only',
	'https://www.googleapis.com/auth/devstorage.full_control',
	'https://www.googleapis.com/auth/devstorage.read_only',
	'https://www.googleapis.com/auth/devstorage.read_write',
];

export class GoogleCloudStorageOAuth2Api implements ICredentialType {
	name = 'googleCloudStorageOAuth2Api';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Cloud Storage OAuth2 API';

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
