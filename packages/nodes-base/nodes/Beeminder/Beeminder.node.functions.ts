import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
} from 'Digital Uprisers-workflow';

import { beeminderApiRequest, beeminderApiRequestAllItems } from './GenericFunctions';

export async function createDatapoint(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	data: IDataObject,
) {
	const credentials = await this.getCredentials('beeminderApi');

	const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints.json`;

	return await beeminderApiRequest.call(this, 'POST', endpoint, data);
}

export async function getAllDatapoints(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	data: IDataObject,
) {
	const credentials = await this.getCredentials('beeminderApi');

	const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints.json`;

	if (data.count !== undefined) {
		return await beeminderApiRequest.call(this, 'GET', endpoint, {}, data);
	}

	return await beeminderApiRequestAllItems.call(this, 'GET', endpoint, {}, data);
}

export async function updateDatapoint(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	data: IDataObject,
) {
	const credentials = await this.getCredentials('beeminderApi');

	const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints/${data.datapointId}.json`;

	return await beeminderApiRequest.call(this, 'PUT', endpoint, data);
}

export async function deleteDatapoint(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	data: IDataObject,
) {
	const credentials = await this.getCredentials('beeminderApi');

	const endpoint = `/users/${credentials.user}/goals/${data.goalName}/datapoints/${data.datapointId}.json`;

	return await beeminderApiRequest.call(this, 'DELETE', endpoint);
}
