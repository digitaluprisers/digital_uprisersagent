import type { INodeTypeBaseDescription, IVersionedNodeType } from 'Digital Uprisers-workflow';
import { VersionedNodeType } from 'Digital Uprisers-workflow';

import { AgentV1 } from './V1/AgentV1.node';
import { AgentV2 } from './V2/AgentV2.node';

export class Agent extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'AI Agent',
			name: 'agent',
			icon: 'fa:robot',
			iconColor: 'black',
			group: ['transform'],
			description: 'Generates an action plan and executes it. Can use external tools.',
			codex: {
				alias: ['LangChain', 'Chat', 'Conversational', 'Plan and Execute', 'ReAct', 'Tools'],
				categories: ['AI'],
				subcategories: {
					AI: ['Agents', 'Root Nodes'],
				},
				resources: {
					primaryDocumentation: [
						{
							url: 'https://docs.digitaluprisers.com/integrations/builtin/cluster-nodes/root-nodes/Digital Uprisers-nodes-langchain.agent/',
						},
					],
				},
			},
			// We keep defaultVersion as 2.1 to ensure we publish streaming when everything is ready
			defaultVersion: 2.1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new AgentV1(baseDescription),
			1.1: new AgentV1(baseDescription),
			1.2: new AgentV1(baseDescription),
			1.3: new AgentV1(baseDescription),
			1.4: new AgentV1(baseDescription),
			1.5: new AgentV1(baseDescription),
			1.6: new AgentV1(baseDescription),
			1.7: new AgentV1(baseDescription),
			1.8: new AgentV1(baseDescription),
			1.9: new AgentV1(baseDescription),
			2: new AgentV2(baseDescription),
			2.1: new AgentV2(baseDescription),
			2.2: new AgentV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
