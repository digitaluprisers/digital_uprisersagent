import type { INodeTypeBaseDescription, IVersionedNodeType } from 'Digital Uprisers-workflow';
import { VersionedNodeType } from 'Digital Uprisers-workflow';

import { FormTriggerV1 } from './v1/FormTriggerV1.node';
import { FormTriggerV2 } from './v2/FormTriggerV2.node';

export class FormTrigger extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Digital Uprisers Form Trigger',
			name: 'formTrigger',
			icon: 'file:form.svg',
			group: ['trigger'],
			description: 'Generate webforms in Digital Uprisers and pass their responses to the workflow',
			defaultVersion: 2.2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new FormTriggerV1(baseDescription),
			2: new FormTriggerV2(baseDescription),
			2.1: new FormTriggerV2(baseDescription),
			2.2: new FormTriggerV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
