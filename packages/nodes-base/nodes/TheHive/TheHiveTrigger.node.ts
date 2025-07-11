import {
	type IWebhookFunctions,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookResponseData,
	NodeConnectionTypes,
} from 'Digital Uprisers-workflow';

import { eventsDescription } from './descriptions/EventsDescription';

export class TheHiveTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheHive Trigger',
		name: 'theHiveTrigger',
		icon: 'file:thehive.svg',
		group: ['trigger'],
		version: [1, 2],
		description: 'Starts the workflow when TheHive events occur',
		defaults: {
			name: 'TheHive Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
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
				displayName:
					'You must set up the webhook in TheHive — instructions <a href="https://docs.digitaluprisers.com/integrations/builtin/trigger-nodes/Digital Uprisers-nodes-base.thehivetrigger/#configure-a-webhook-in-thehive" target="_blank">here</a>',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			...eventsDescription,
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Get the request body
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events', []) as string[];
		if (!bodyData.operation || !bodyData.objectType) {
			// Don't start the workflow if mandatory fields are not specified
			return {};
		}

		// Don't start the workflow if the event is not fired
		// Replace Creation with Create for TheHive 3 support
		const operation = (bodyData.operation as string).replace('Creation', 'Create');
		const event = `${(bodyData.objectType as string).toLowerCase()}_${operation.toLowerCase()}`;

		if (events.indexOf('*') === -1 && events.indexOf(event) === -1) {
			return {};
		}

		// The data to return and so start the workflow with
		const returnData: IDataObject[] = [];
		returnData.push({
			event,
			body: this.getBodyData(),
			headers: this.getHeaderData(),
			query: this.getQueryData(),
		});

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
