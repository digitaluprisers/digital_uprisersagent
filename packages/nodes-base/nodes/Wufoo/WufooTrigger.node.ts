import { randomBytes } from 'crypto';
import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes, jsonParse } from 'Digital Uprisers-workflow';

import { wufooApiRequest } from './GenericFunctions';
import type { IField, IWebhook } from './Interface';

export class WufooTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wufoo Trigger',
		name: 'wufooTrigger',
		// eslint-disable-next-line Digital Uprisers-nodes-base/node-class-description-icon-not-svg
		icon: 'file:wufoo.png',
		group: ['trigger'],
		version: 1,
		description: 'Handle Wufoo events via webhooks',
		defaults: {
			name: 'Wufoo Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'wufooApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Forms Name or ID',
				name: 'form',
				type: 'options',
				required: true,
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getForms',
				},
				description:
					'The form upon which will trigger this node when a new entry is made. Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Only Answers',
				name: 'onlyAnswers',
				type: 'boolean',
				default: true,
				description: 'Whether to return only the answers of the form and not any of the other data',
			},
		],
	};

	methods = {
		loadOptions: {
			async getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

				// https://wufoo.github.io/docs/#all-forms
				const formObject = await wufooApiRequest.call(this, 'GET', 'forms.json');
				for (const form of formObject.Forms) {
					const name = form.Name;
					const value = form.Hash;
					returnData.push({
						name,
						value,
					});
				}
				// Entries submitted on the same day are present in separate property in data object
				if (formObject.EntryCountToday) {
					for (const form of formObject.EntryCountToday) {
						const name = form.Name;
						const value = form.Hash;
						returnData.push({
							name,
							value,
						});
					}
				}
				return returnData;
			},
		},
	};

	webhookMethods = {
		default: {
			// No API endpoint to allow checking of existing webhooks.
			// Creating new webhook will not overwrite existing one if parameters are the same.
			// Otherwise an update occurs.
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const formHash = this.getNodeParameter('form') as IDataObject;
				const endpoint = `forms/${formHash}/webhooks.json`;

				// Handshake key for webhook endpoint protection
				webhookData.handshakeKey = randomBytes(20).toString('hex');
				const body: IWebhook = {
					url: webhookUrl as string,
					handshakeKey: webhookData.handshakeKey,
					metadata: true,
				};

				const result = await wufooApiRequest.call(this, 'PUT', endpoint, body);
				webhookData.webhookId = result.WebHookPutResult.Hash;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const formHash = this.getNodeParameter('form') as IDataObject;
				const endpoint = `forms/${formHash}/webhooks/${webhookData.webhookId}.json`;
				try {
					await wufooApiRequest.call(this, 'DELETE', endpoint);
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				delete webhookData.handshakeKey;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData();
		const webhookData = this.getWorkflowStaticData('node');
		const onlyAnswers = this.getNodeParameter('onlyAnswers') as boolean;
		const entries: IDataObject = {};
		let returnObject: IDataObject = {};

		if (req.body.HandshakeKey !== webhookData.handshakeKey) {
			return {};
		}

		const fieldsObject = jsonParse<any>(req.body.FieldStructure as string, {
			errorMessage: "Invalid JSON in request body field 'FieldStructure'",
		});

		fieldsObject.Fields.map((field: IField) => {
			// TODO
			// Handle docusign field

			if (field.Type === 'file') {
				entries[field.Title] = req.body[`${field.ID}-url`];
			} else if (field.Type === 'address') {
				const address: IDataObject = {};

				for (const subfield of field.SubFields) {
					address[subfield.Label] = body[subfield.ID];
				}

				entries[field.Title] = address;
			} else if (field.Type === 'checkbox') {
				const responses: string[] = [];

				for (const subfield of field.SubFields) {
					if (body[subfield.ID] !== '') {
						responses.push(body[subfield.ID] as string);
					}
				}

				entries[field.Title] = responses;
			} else if (field.Type === 'likert') {
				const likert: IDataObject = {};

				for (const subfield of field.SubFields) {
					likert[subfield.Label] = body[subfield.ID];
				}

				entries[field.Title] = likert;
			} else if (field.Type === 'shortname') {
				const shortname: IDataObject = {};

				for (const subfield of field.SubFields) {
					shortname[subfield.Label] = body[subfield.ID];
				}

				entries[field.Title] = shortname;
			} else {
				entries[field.Title] = req.body[field.ID];
			}
		});

		if (!onlyAnswers) {
			returnObject = {
				createdBy: req.body.CreatedBy as string,
				entryId: req.body.EntryId as number,
				dateCreated: req.body.DateCreated as Date,
				formId: req.body.FormId as string,
				formStructure: jsonParse(req.body.FormStructure as string, {
					errorMessage: "Invalid JSON in request body field 'FormStructure'",
				}),
				fieldStructure: jsonParse(req.body.FieldStructure as string, {
					errorMessage: "Invalid JSON in request body field 'FieldStructure'",
				}),
				entries,
			};

			return {
				workflowData: [this.helpers.returnJsonArray([returnObject as unknown as IDataObject])],
			};
		} else {
			return {
				workflowData: [this.helpers.returnJsonArray(entries as unknown as IDataObject)],
			};
		}
	}
}
