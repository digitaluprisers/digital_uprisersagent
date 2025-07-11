import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'Digital Uprisers-workflow';

import { bucketFields, bucketOperations } from './BucketDescription';
import { objectFields, objectOperations } from './ObjectDescription';

export class GoogleCloudStorage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Cloud Storage',
		name: 'googleCloudStorage',
		icon: 'file:googleCloudStorage.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use the Google Cloud Storage API',
		defaults: {
			name: 'Google Cloud Storage',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'googleCloudStorageOAuth2Api',
				required: true,
				testedBy: {
					request: {
						method: 'GET',
						url: '/b/',
					},
				},
			},
		],
		requestDefaults: {
			returnFullResponse: true,
			baseURL: 'https://storage.googleapis.com/storage/v1',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Bucket',
						value: 'bucket',
					},
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'bucket',
			},

			// BUCKET
			...bucketOperations,
			...bucketFields,

			// OBJECT
			...objectOperations,
			...objectFields,
		],
	};
}
