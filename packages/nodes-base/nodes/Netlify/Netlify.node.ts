import type {
	IExecuteFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';

import { deployFields, deployOperations } from './DeployDescription';
import { netlifyApiRequest, netlifyRequestAllItems } from './GenericFunctions';
import { siteFields, siteOperations } from './SiteDescription';

export class Netlify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Netlify',
		name: 'netlify',
		icon: 'file:netlify.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Netlify API',
		defaults: {
			name: 'Netlify',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'netlifyApi',
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
						name: 'Deploy',
						value: 'deploy',
					},
					{
						name: 'Site',
						value: 'site',
					},
				],
				default: 'deploy',
				required: true,
			},
			...deployOperations,
			...deployFields,
			...siteOperations,
			...siteFields,
		],
	};

	methods = {
		loadOptions: {
			async getSites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const sites = await netlifyApiRequest.call(this, 'GET', '/sites');
				for (const site of sites) {
					returnData.push({
						name: site.name,
						value: site.site_id,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const length = items.length;
		let responseData;
		const returnData: INodeExecutionData[] = [];
		const qs: IDataObject = {};
		const body: IDataObject = {};
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'deploy') {
					if (operation === 'cancel') {
						const deployId = this.getNodeParameter('deployId', i);
						responseData = await netlifyApiRequest.call(
							this,
							'POST',
							`/deploys/${deployId}/cancel`,
							body,
							qs,
						);
					}

					if (operation === 'create') {
						const siteId = this.getNodeParameter('siteId', i);
						const additionalFields = this.getNodeParameter('additionalFields', i);

						Object.assign(body, additionalFields);

						if (body.title) {
							qs.title = body.title;
							delete body.title;
						}

						responseData = await netlifyApiRequest.call(
							this,
							'POST',
							`/sites/${siteId}/deploys`,
							body,
							qs,
						);
					}

					if (operation === 'get') {
						const siteId = this.getNodeParameter('siteId', i);
						const deployId = this.getNodeParameter('deployId', i);
						responseData = await netlifyApiRequest.call(
							this,
							'GET',
							`/sites/${siteId}/deploys/${deployId}`,
							body,
							qs,
						);
					}

					if (operation === 'getAll') {
						const siteId = this.getNodeParameter('siteId', i);
						const returnAll = this.getNodeParameter('returnAll', i);
						if (returnAll) {
							responseData = await netlifyRequestAllItems.call(
								this,
								'GET',
								`/sites/${siteId}/deploys`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i);
							responseData = await netlifyApiRequest.call(
								this,
								'GET',
								`/sites/${siteId}/deploys`,
								{},
								{ per_page: limit },
							);
						}
					}
				}
				if (resource === 'site') {
					if (operation === 'delete') {
						const siteId = this.getNodeParameter('siteId', i);
						responseData = await netlifyApiRequest.call(this, 'DELETE', `/sites/${siteId}`);
					}

					if (operation === 'get') {
						const siteId = this.getNodeParameter('siteId', i);
						responseData = await netlifyApiRequest.call(this, 'GET', `/sites/${siteId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						if (returnAll) {
							responseData = await netlifyRequestAllItems.call(
								this,
								'GET',
								'/sites',
								{},
								{ filter: 'all' },
							);
						} else {
							const limit = this.getNodeParameter('limit', i);
							responseData = await netlifyApiRequest.call(
								this,
								'GET',
								'/sites',
								{},
								{ filter: 'all', per_page: limit },
							);
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
