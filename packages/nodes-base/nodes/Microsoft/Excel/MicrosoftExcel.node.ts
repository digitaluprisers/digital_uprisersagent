import type { INodeTypeBaseDescription, IVersionedNodeType } from 'Digital Uprisers-workflow';
import { VersionedNodeType } from 'Digital Uprisers-workflow';

import { MicrosoftExcelV1 } from './v1/MicrosoftExcelV1.node';
import { MicrosoftExcelV2 } from './v2/MicrosoftExcelV2.node';

export class MicrosoftExcel extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Microsoft Excel 365',
			name: 'microsoftExcel',
			icon: 'file:excel.svg',
			group: ['input'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume Microsoft Excel API',
			defaultVersion: 2.1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new MicrosoftExcelV1(baseDescription),
			2: new MicrosoftExcelV2(baseDescription),
			2.1: new MicrosoftExcelV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
