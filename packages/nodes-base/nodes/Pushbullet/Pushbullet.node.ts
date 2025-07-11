import moment from 'moment-timezone';
import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes } from 'Digital Uprisers-workflow';

import { pushbulletApiRequest, pushbulletApiRequestAllItems } from './GenericFunctions';

export class Pushbullet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pushbullet',
		name: 'pushbullet',
		icon: 'file:pushbullet.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Pushbullet API',
		defaults: {
			name: 'Pushbullet',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'pushbulletOAuth2Api',
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
						name: 'Push',
						value: 'push',
					},
				],
				default: 'push',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['push'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a push',
						action: 'Create a push',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a push',
						action: 'Delete a push',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many pushes',
						action: 'Get many pushes',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a push',
						action: 'Update a push',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Link',
						value: 'link',
					},
					{
						name: 'Note',
						value: 'note',
					},
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
					},
				},
				default: 'note',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
						type: ['note', 'link'],
					},
				},
				default: '',
				description: 'Title of the push',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
						type: ['note', 'link', 'file'],
					},
				},
				default: '',
				description: 'Body of the push',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
						type: ['link'],
					},
				},
				default: '',
				description: 'URL of the push',
			},
			{
				displayName: 'Input Binary Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
						type: ['file'],
					},
				},
				placeholder: '',
				hint: 'The name of the input binary field containing the file to be written',
			},
			{
				displayName: 'Target',
				name: 'target',
				type: 'options',
				options: [
					{
						name: 'Channel Tag',
						value: 'channel_tag',
						description: 'Send the push to all subscribers to your channel that has this tag',
					},
					{
						name: 'Default',
						value: 'default',
						description: "Broadcast it to all of the user's devices",
					},
					{
						name: 'Device ID',
						value: 'device_iden',
						description: 'Send the push to a specific device',
					},
					{
						name: 'Email',
						value: 'email',
						description: 'Send the push to this email address',
					},
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
					},
				},
				default: 'default',
				description: 'Define the medium that will be used to send the push',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
					},
					hide: {
						target: ['default', 'device_iden'],
					},
				},
				default: '',
				description:
					'The value to be set depending on the target selected. For example, if the target selected is email then this field would take the email address of the person you are trying to send the push to.',
			},
			{
				displayName: 'Value Name or ID',
				name: 'value',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getDevices',
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['create'],
						target: ['device_iden'],
					},
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
			},
			{
				displayName: 'Push ID',
				name: 'pushId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['delete'],
					},
				},
				default: '',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
						resource: ['push'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						resource: ['push'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 100,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Active',
						name: 'active',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-description-boolean-without-whether
						description: "Don't return deleted pushes",
					},
					{
						displayName: 'Modified After',
						name: 'modified_after',
						type: 'dateTime',
						default: '',
						description: 'Request pushes modified after this timestamp',
					},
				],
			},
			{
				displayName: 'Push ID',
				name: 'pushId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['update'],
					},
				},
				default: '',
			},
			{
				displayName: 'Dismissed',
				name: 'dismissed',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['push'],
						operation: ['update'],
					},
				},
				default: false,
				description:
					'Whether to mark a push as having been dismissed by the user, will cause any notifications for the push to be hidden if possible',
			},
		],
	};

	methods = {
		loadOptions: {
			async getDevices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { devices } = await pushbulletApiRequest.call(this, 'GET', '/devices');
				for (const device of devices) {
					returnData.push({
						name: device.nickname,
						value: device.iden,
					});
				}
				return returnData;
			},
		},
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
				if (resource === 'push') {
					if (operation === 'create') {
						const type = this.getNodeParameter('type', i) as string;

						const message = this.getNodeParameter('body', i) as string;

						const target = this.getNodeParameter('target', i) as string;

						const body: IDataObject = {
							type,
							body: message,
						};

						if (target !== 'default') {
							const value = this.getNodeParameter('value', i) as string;
							body[target] = value;
						}

						if (['note', 'link'].includes(type)) {
							body.title = this.getNodeParameter('title', i) as string;

							if (type === 'link') {
								body.url = this.getNodeParameter('url', i) as string;
							}
						}

						if (type === 'file') {
							const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
							const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
							const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

							//create upload url
							const {
								upload_url: uploadUrl,
								file_name,
								file_type,
								file_url,
							} = await pushbulletApiRequest.call(this, 'POST', '/upload-request', {
								file_name: binaryData.fileName,
								file_type: binaryData.mimeType,
							});

							//upload the file
							await pushbulletApiRequest.call(this, 'POST', '', {}, {}, uploadUrl as string, {
								formData: {
									file: {
										value: dataBuffer,
										options: {
											filename: binaryData.fileName,
										},
									},
								},
								json: false,
							});

							body.file_name = file_name;
							body.file_type = file_type;
							body.file_url = file_url;
						}

						responseData = await pushbulletApiRequest.call(this, 'POST', '/pushes', body);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', 0);

						const filters = this.getNodeParameter('filters', i);

						Object.assign(qs, filters);

						if (qs.modified_after) {
							qs.modified_after = moment(qs.modified_after as string).unix();
						}

						if (returnAll) {
							responseData = await pushbulletApiRequestAllItems.call(
								this,
								'pushes',
								'GET',
								'/pushes',
								{},
								qs,
							);
						} else {
							qs.limit = this.getNodeParameter('limit', 0);

							responseData = await pushbulletApiRequest.call(this, 'GET', '/pushes', {}, qs);

							responseData = responseData.pushes;
						}
					}

					if (operation === 'delete') {
						const pushId = this.getNodeParameter('pushId', i) as string;

						responseData = await pushbulletApiRequest.call(this, 'DELETE', `/pushes/${pushId}`);

						responseData = { success: true };
					}

					if (operation === 'update') {
						const pushId = this.getNodeParameter('pushId', i) as string;

						const dismissed = this.getNodeParameter('dismissed', i) as boolean;

						responseData = await pushbulletApiRequest.call(this, 'POST', `/pushes/${pushId}`, {
							dismissed,
						});
					}
				}
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
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
