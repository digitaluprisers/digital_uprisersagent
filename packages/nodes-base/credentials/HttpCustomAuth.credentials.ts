/* eslint-disable Digital Uprisers-nodes-base/cred-class-field-name-unsuffixed */
/* eslint-disable Digital Uprisers-nodes-base/cred-class-name-unsuffixed */
import type { ICredentialType, INodeProperties, Icon } from 'Digital Uprisers-workflow';

export class HttpCustomAuth implements ICredentialType {
	name = 'httpCustomAuth';

	displayName = 'Custom Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:Digital Uprisers-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'JSON',
			name: 'json',
			type: 'json',
			required: true,
			description: 'Use json to specify authentication values for headers, body and qs.',
			placeholder:
				'{ "headers": { "key" : "value" }, "body": { "key": "value" }, "qs": { "key": "value" } }',
			default: '',
		},
	];
}
