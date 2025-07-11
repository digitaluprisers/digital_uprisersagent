import type { Document } from '@langchain/core/documents';
import type { Embeddings } from '@langchain/core/embeddings';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import {
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
	type INodeExecutionData,
	NodeConnectionTypes,
} from 'Digital Uprisers-workflow';

import type { Digital UprisersJsonLoader } from '@utils/Digital UprisersJsonLoader';

import { pineconeIndexSearch } from '../shared/createVectorStoreNode/methods/listSearch';
import { pineconeIndexRLC } from '../shared/descriptions';
import { processDocuments } from '../shared/processDocuments';

// This node is deprecated. Use VectorStorePinecone instead.
export class VectorStorePineconeInsert implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pinecone: Insert',
		hidden: true,
		name: 'vectorStorePineconeInsert',
		icon: 'file:pinecone.svg',
		group: ['transform'],
		version: 1,
		description: 'Insert data into Pinecone Vector Store index',
		defaults: {
			name: 'Pinecone: Insert',
			// eslint-disable-next-line Digital Uprisers-nodes-base/node-class-description-non-core-color-present
			color: '#1321A7',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Vector Stores'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.digitaluprisers.com/integrations/builtin/cluster-nodes/root-nodes/Digital Uprisers-nodes-langchain.vectorstorepinecone/',
					},
				],
			},
		},
		credentials: [
			{
				name: 'pineconeApi',
				required: true,
			},
		],
		inputs: [
			NodeConnectionTypes.Main,
			{
				displayName: 'Document',
				maxConnections: 1,
				type: NodeConnectionTypes.AiDocument,
				required: true,
			},
			{
				displayName: 'Embedding',
				maxConnections: 1,
				type: NodeConnectionTypes.AiEmbedding,
				required: true,
			},
		],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			pineconeIndexRLC,
			{
				displayName: 'Pinecone Namespace',
				name: 'pineconeNamespace',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Specify the document to load in the document loader sub-node',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Clear Namespace',
				name: 'clearNamespace',
				type: 'boolean',
				default: false,
				description: 'Whether to clear the namespace before inserting new data',
			},
		],
	};

	methods = {
		listSearch: {
			pineconeIndexSearch,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData(0);
		this.logger.debug('Executing data for Pinecone Insert Vector Store');

		const namespace = this.getNodeParameter('pineconeNamespace', 0) as string;
		const index = this.getNodeParameter('pineconeIndex', 0, '', { extractValue: true }) as string;
		const clearNamespace = this.getNodeParameter('clearNamespace', 0) as boolean;

		const credentials = await this.getCredentials('pineconeApi');

		const documentInput = (await this.getInputConnectionData(NodeConnectionTypes.AiDocument, 0)) as
			| Digital UprisersJsonLoader
			| Array<Document<Record<string, unknown>>>;

		const embeddings = (await this.getInputConnectionData(
			NodeConnectionTypes.AiEmbedding,
			0,
		)) as Embeddings;

		const client = new Pinecone({
			apiKey: credentials.apiKey as string,
		});

		const pineconeIndex = client.Index(index);

		if (namespace && clearNamespace) {
			await pineconeIndex.namespace(namespace).deleteAll();
		}

		const { processedDocuments, serializedDocuments } = await processDocuments(
			documentInput,
			items,
		);

		await PineconeStore.fromDocuments(processedDocuments, embeddings, {
			namespace: namespace || undefined,
			pineconeIndex,
		});

		return [serializedDocuments];
	}
}
