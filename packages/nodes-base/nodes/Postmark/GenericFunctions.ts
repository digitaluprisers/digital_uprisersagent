import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function postmarkApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	option: IDataObject = {},
): Promise<any> {
	let options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		method,
		body,
		uri: 'https://api.postmarkapp.com' + endpoint,
		json: true,
	};
	if (Object.keys(body as IDataObject).length === 0) {
		delete options.body;
	}
	options = Object.assign({}, options, option);

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'postmarkApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function convertTriggerObjectToStringArray(webhookObject: any): string[] {
	const triggers = webhookObject.Triggers;
	const webhookEvents: string[] = [];

	// Translate Webhook trigger settings to string array
	if (triggers.Open.Enabled) {
		webhookEvents.push('open');
	}
	if (triggers.Open.PostFirstOpenOnly) {
		webhookEvents.push('firstOpen');
	}
	if (triggers.Click.Enabled) {
		webhookEvents.push('click');
	}
	if (triggers.Delivery.Enabled) {
		webhookEvents.push('delivery');
	}
	if (triggers.Bounce.Enabled) {
		webhookEvents.push('bounce');
	}
	if (triggers.Bounce.IncludeContent) {
		webhookEvents.push('includeContent');
	}
	if (triggers.SpamComplaint.Enabled) {
		webhookEvents.push('spamComplaint');
	}
	if (triggers.SpamComplaint.IncludeContent) {
		if (!webhookEvents.includes('IncludeContent')) {
			webhookEvents.push('includeContent');
		}
	}
	if (triggers.SubscriptionChange.Enabled) {
		webhookEvents.push('subscriptionChange');
	}

	return webhookEvents;
}

export function eventExists(currentEvents: string[], webhookEvents: string[]) {
	for (const currentEvent of currentEvents) {
		if (!webhookEvents.includes(currentEvent)) {
			return false;
		}
	}
	return true;
}
