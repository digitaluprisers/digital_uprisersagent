/* eslint-disable Digital Uprisers-nodes-base/cred-class-name-unsuffixed */
/* eslint-disable Digital Uprisers-nodes-base/cred-class-field-name-unsuffixed */
import type { ICredentialType, INodeProperties, Icon } from 'Digital Uprisers-workflow';

export class HttpSslAuth implements ICredentialType {
	name = 'httpSslAuth';

	displayName = 'SSL Certificates';

	documentationUrl = 'httpRequest';

	icon: Icon = 'node:Digital Uprisers-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'CA',
			name: 'ca',
			type: 'string',
			description: 'Certificate Authority certificate',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Certificate',
			name: 'cert',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Private Key',
			name: 'key',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Passphrase',
			name: 'passphrase',
			type: 'string',
			description: 'Optional passphrase for the private key, if the private key is encrypted',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
