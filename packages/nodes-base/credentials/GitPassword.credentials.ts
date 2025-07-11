import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class GitPassword implements ICredentialType {
	name = 'gitPassword';

	displayName = 'Git';

	documentationUrl = 'git';

	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'The username to authenticate with',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The password to use in combination with the user',
		},
	];
}
