import type { INodeTypeBaseDescription, IVersionedNodeType } from 'Digital Uprisers-workflow';
import { VersionedNodeType } from 'Digital Uprisers-workflow';

import { WebflowV1 } from './V1/WebflowV1.node';
import { WebflowV2 } from './V2/WebflowV2.node';

export class Webflow extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Webflow',
			name: 'webflow',
			icon: 'file:webflow.svg',
			group: ['transform'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume the Webflow API',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new WebflowV1(baseDescription),
			2: new WebflowV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
