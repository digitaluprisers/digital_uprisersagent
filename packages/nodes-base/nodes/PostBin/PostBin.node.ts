import type { INodeType, INodeTypeDescription } from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';

import { binFields, binOperations } from './BinDescription';
import { requestFields, requestOperations } from './RequestDescription';

export class PostBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PostBin',
		name: 'postBin',
		icon: 'file:postbin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Consume PostBin API',
		defaults: {
			name: 'PostBin',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [],
		requestDefaults: {
			baseURL: 'https://www.postb.in',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Bin',
						value: 'bin',
					},
					{
						name: 'Request',
						value: 'request',
					},
				],
				default: 'bin',
				required: true,
			},
			...binOperations,
			...binFields,
			...requestOperations,
			...requestFields,
		],
	};
}
