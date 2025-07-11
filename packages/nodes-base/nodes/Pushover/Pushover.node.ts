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

import { pushoverApiRequest } from './GenericFunctions';

export class Pushover implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pushover',
		name: 'pushover',
		icon: 'file:pushover.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Pushover API',
		defaults: {
			name: 'Pushover',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'pushoverApi',
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
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Push',
						value: 'push',
						action: 'Push a message',
					},
				],
				default: 'push',
			},
			{
				displayName: 'User Key',
				name: 'userKey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
					},
				},
				default: '',
				description:
					'The user/group key (not e-mail address) of your user (or you), viewable when logged into the <a href="https://pushover.net/">dashboard</a> (often referred to as <code>USER_KEY</code> in the <a href="https://support.pushover.net/i44-example-code-and-pushover-libraries">libraries</a> and code examples)',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
					},
				},
				default: '',
				description: 'Your message',
			},

			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
					},
				},
				// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Lowest Priority',
						value: -2,
					},
					{
						name: 'Low Priority',
						value: -1,
					},
					{
						name: 'Normal Priority',
						value: 0,
					},
					{
						name: 'High Priority',
						value: 1,
					},
					{
						name: 'Emergency Priority',
						value: 2,
					},
				],
				default: -2,
				description:
					"Send as -2 to generate no notification/alert, -1 to always send as a quiet notification, 1 to display as high-priority and bypass the user's quiet hours, or 2 to also require confirmation from the user",
			},
			{
				displayName: 'Retry (Seconds)',
				name: 'retry',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
						priority: [2],
					},
				},
				default: 30,
				description:
					'Specifies how often (in seconds) the Pushover servers will send the same notification to the user. This parameter must have a value of at least 30 seconds between retries.',
			},
			{
				displayName: 'Expire (Seconds)',
				name: 'expire',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 10800,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
						priority: [2],
					},
				},
				default: 30,
				description:
					'Specifies how many seconds your notification will continue to be retried for (every retry seconds)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['push'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Attachment',
						name: 'attachmentsUi',
						placeholder: 'Add Attachments',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: false,
						},
						options: [
							{
								name: 'attachmentsValues',
								displayName: 'Attachment Property',
								values: [
									{
										displayName: 'Input Binary Field',
										name: 'binaryPropertyName',
										type: 'string',
										default: '',
										placeholder: 'data',
										hint: 'The name of the input binary field containing the file which should be added to email as attachment',
									},
								],
							},
						],
						default: {},
					},
					{
						displayName: 'Device',
						name: 'device',
						type: 'string',
						default: '',
						description:
							"Your user's device name to send the message directly to that device, rather than all of the user's devices (multiple devices may be separated by a comma)",
					},
					{
						displayName: 'HTML Formatting',
						name: 'html',
						type: 'boolean',
						default: false,
						description: 'Whether to enable messages formatting with HTML tags',
					},
					{
						displayName: 'Sound Name or ID',
						name: 'sound',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getSounds',
						},
						default: '',
						description:
							'The name of one of the sounds supported by device clients to override the user\'s default sound choice. Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Timestamp',
						name: 'timestamp',
						type: 'dateTime',
						default: '',
						description:
							"A Unix timestamp of your message's date and time to display to the user, rather than the time your message is received by our API",
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: "Your message's title, otherwise your app's name is used",
					},
					{
						displayName: 'Timestamp',
						name: 'timestamp',
						type: 'dateTime',
						default: '',
						description:
							"A Unix timestamp of your message's date and time to display to the user, rather than the time your message is received by our API",
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						description: 'A supplementary URL to show with your message',
					},
					{
						displayName: 'URL Title',
						name: 'url_title',
						type: 'string',
						default: '',
						description: 'A title for your supplementary URL, otherwise just the URL is shown',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getSounds(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { sounds } = await pushoverApiRequest.call(this, 'GET', '/sounds.json', {});
				const returnData: INodePropertyOptions[] = [];
				for (const key of Object.keys(sounds as IDataObject)) {
					returnData.push({
						name: sounds[key],
						value: key,
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
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'message') {
					if (operation === 'push') {
						const userKey = this.getNodeParameter('userKey', i) as string;

						const message = this.getNodeParameter('message', i) as string;

						const priority = this.getNodeParameter('priority', i) as number;

						const additionalFields = this.getNodeParameter('additionalFields', i);

						if (additionalFields.html !== undefined) {
							additionalFields.html = additionalFields.html ? '1' : '';
						}

						const body: IDataObject = {
							user: userKey,
							message,
							priority,
						};

						if (priority === 2) {
							body.retry = this.getNodeParameter('retry', i) as number;

							body.expire = this.getNodeParameter('expire', i) as number;
						}

						Object.assign(body, additionalFields);

						if (body.attachmentsUi) {
							const attachment = (body.attachmentsUi as IDataObject)
								.attachmentsValues as IDataObject;

							if (attachment) {
								const binaryPropertyName = attachment.binaryPropertyName as string;
								const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
								const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								body.attachment = {
									value: dataBuffer,
									options: {
										filename: binaryData.fileName,
									},
								};

								delete body.attachmentsUi;
							}
						}

						responseData = await pushoverApiRequest.call(this, 'POST', '/messages.json', body);
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as IDataObject),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
