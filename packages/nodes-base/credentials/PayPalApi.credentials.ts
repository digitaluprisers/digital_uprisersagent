import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class PayPalApi implements ICredentialType {
	name = 'payPalApi';

	displayName = 'PayPal API';

	documentationUrl = 'payPal';

	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Secret',
			name: 'secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Environment',
			name: 'env',
			type: 'options',
			default: 'live',
			options: [
				{
					name: 'Sandbox',
					value: 'sanbox',
				},
				{
					name: 'Live',
					value: 'live',
				},
			],
		},
	];
}
