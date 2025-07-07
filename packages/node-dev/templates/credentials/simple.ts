import { ICredentialType, NodePropertyTypes, INodeProperties } from 'Digital Uprisers-workflow';

export class ClassNameReplace implements ICredentialType {
	name = 'Digital UprisersNameReplace';

	displayName = 'DisplayNameReplace';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			default: '',
		},
	];
}
