import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';

const BEEMINDER_URI = 'https://www.beeminder.com/api/v1';

export async function beeminderApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const options: IRequestOptions = {
		method,
		body,
		qs: query,
		uri: `${BEEMINDER_URI}${endpoint}`,
		json: true,
	};

	if (!Object.keys(body as IDataObject).length) {
		delete options.body;
	}

	if (!Object.keys(query).length) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'beeminderApi', options);
}

export async function beeminderApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.page = 1;
	do {
		responseData = await beeminderApiRequest.call(this, method, endpoint, body, query);
		query.page++;
		returnData.push.apply(returnData, responseData as IDataObject[]);
	} while (responseData.length !== 0);

	return returnData;
}
