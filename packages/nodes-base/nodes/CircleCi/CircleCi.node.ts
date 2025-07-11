import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';

import { circleciApiRequest, circleciApiRequestAllItems } from './GenericFunctions';
import { pipelineFields, pipelineOperations } from './PipelineDescription';

export class CircleCi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CircleCI',
		name: 'circleCi',

		icon: { light: 'file:circleCi.svg', dark: 'file:circleCi.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume CircleCI API',
		defaults: {
			name: 'CircleCI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'circleCiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Pipeline',
						value: 'pipeline',
					},
				],
				default: 'pipeline',
			},
			...pipelineOperations,
			...pipelineFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		const qs: IDataObject = {};
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'pipeline') {
					if (operation === 'get') {
						const vcs = this.getNodeParameter('vcs', i) as string;
						let slug = this.getNodeParameter('projectSlug', i) as string;
						const pipelineNumber = this.getNodeParameter('pipelineNumber', i) as number;

						slug = slug.replace(new RegExp(/\//g), '%2F');

						const endpoint = `/project/${vcs}/${slug}/pipeline/${pipelineNumber}`;

						responseData = await circleciApiRequest.call(this, 'GET', endpoint, {}, qs);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
					if (operation === 'getAll') {
						const vcs = this.getNodeParameter('vcs', i) as string;
						const filters = this.getNodeParameter('filters', i);
						const returnAll = this.getNodeParameter('returnAll', i);
						let slug = this.getNodeParameter('projectSlug', i) as string;

						slug = slug.replace(new RegExp(/\//g), '%2F');

						if (filters.branch) {
							qs.branch = filters.branch;
						}

						const endpoint = `/project/${vcs}/${slug}/pipeline`;

						if (returnAll) {
							responseData = await circleciApiRequestAllItems.call(
								this,
								'items',
								'GET',
								endpoint,
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', i);
							responseData = await circleciApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseData = responseData.items;
							responseData = responseData.splice(0, qs.limit);
						}
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					}

					if (operation === 'trigger') {
						const vcs = this.getNodeParameter('vcs', i) as string;
						let slug = this.getNodeParameter('projectSlug', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i);

						slug = slug.replace(new RegExp(/\//g), '%2F');

						const endpoint = `/project/${vcs}/${slug}/pipeline`;

						const body: IDataObject = {};

						if (additionalFields.branch) {
							body.branch = additionalFields.branch as string;
						}

						if (additionalFields.tag) {
							body.tag = additionalFields.tag as string;
						}

						responseData = await circleciApiRequest.call(this, 'POST', endpoint, body, qs);
						responseData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject[]),
							{ itemData: { item: i } },
						);
					}
				}

				returnData.push(...(responseData as INodeExecutionData[]));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {}, itemIndex: i });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
