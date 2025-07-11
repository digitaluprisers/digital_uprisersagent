import type { ICredentialType, INodeProperties } from 'Digital Uprisers-workflow';

export class SecurityScorecardApi implements ICredentialType {
	name = 'securityScorecardApi';

	displayName = 'SecurityScorecard API';

	documentationUrl = 'securityScorecard';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];
}
