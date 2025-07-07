import type { INodeTypeBaseDescription, IVersionedNodeType } from 'Digital Uprisers-workflow';
import { VersionedNodeType } from 'Digital Uprisers-workflow';

import { ChainSummarizationV1 } from './V1/ChainSummarizationV1.node';
import { ChainSummarizationV2 } from './V2/ChainSummarizationV2.node';

export class ChainSummarization extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Summarization Chain',
			name: 'chainSummarization',
			icon: 'fa:link',
			iconColor: 'black',
			group: ['transform'],
			description: 'Transforms text into a concise summary',
			codex: {
				alias: ['LangChain'],
				categories: ['AI'],
				subcategories: {
					AI: ['Chains', 'Root Nodes'],
				},
				resources: {
					primaryDocumentation: [
						{
							url: 'https://docs.digitaluprisers.com/integrations/builtin/cluster-nodes/root-nodes/Digital Uprisers-nodes-langchain.chainsummarization/',
						},
					],
				},
			},
			defaultVersion: 2.1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new ChainSummarizationV1(baseDescription),
			2: new ChainSummarizationV2(baseDescription),
			2.1: new ChainSummarizationV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
