import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class Smtp implements ICredentialType {
	name = 'smtp';

	displayName = 'SMTP';

	documentationUrl = 'sendemail';

	properties: INodeProperties[] = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 465,
		},
		{
			displayName: 'SSL/TLS',
			name: 'secure',
			type: 'boolean',
			default: true,
		},
		{
			displayName: 'Disable STARTTLS',
			name: 'disableStartTls',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					secure: [false],
				},
			},
		},
		{
			displayName: 'Client Host Name',
			name: 'hostName',
			type: 'string',
			default: '',
			placeholder: '',
			description: 'The hostname of the client, used for identifying to the server',
		},
	];
}
