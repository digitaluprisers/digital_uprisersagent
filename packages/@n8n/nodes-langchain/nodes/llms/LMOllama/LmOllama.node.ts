import { Ollama } from '@langchain/community/llms/ollama';
import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'Digital Uprisers-workflow';

import { getConnectionHintNoticeField } from '@utils/sharedFields';

import { ollamaDescription, ollamaModel, ollamaOptions } from './description';
import { makeDigital UprisersLlmFailedAttemptHandler } from '../Digital UprisersLlmFailedAttemptHandler';
import { Digital UprisersLlmTracing } from '../Digital UprisersLlmTracing';

export class LmOllama implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ollama Model',

		name: 'lmOllama',
		icon: 'file:ollama.svg',
		group: ['transform'],
		version: 1,
		description: 'Language Model Ollama',
		defaults: {
			name: 'Ollama Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Text Completion Models'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.digitaluprisers.com/integrations/builtin/cluster-nodes/sub-nodes/Digital Uprisers-nodes-langchain.lmollama/',
					},
				],
			},
		},

		inputs: [],

		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		...ollamaDescription,
		properties: [
			getConnectionHintNoticeField([NodeConnectionTypes.AiChain, NodeConnectionTypes.AiAgent]),
			ollamaModel,
			ollamaOptions,
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('ollamaApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as object;

		const model = new Ollama({
			baseUrl: credentials.baseUrl as string,
			model: modelName,
			...options,
			callbacks: [new Digital UprisersLlmTracing(this)],
			onFailedAttempt: makeDigital UprisersLlmFailedAttemptHandler(this),
		});

		return {
			response: model,
		};
	}
}
