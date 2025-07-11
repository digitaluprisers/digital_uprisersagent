import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class AcuitySchedulingApi implements ICredentialType {
	name = 'acuitySchedulingApi';

	displayName = 'Acuity Scheduling API';

	documentationUrl = 'acuityScheduling';

	properties: INodeProperties[] = [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
