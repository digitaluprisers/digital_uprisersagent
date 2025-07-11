import { snakeCase } from 'change-case';
import type {
	JsonObject,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function pagerDutyApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0);

	const options: IRequestOptions = {
		headers: {
			Accept: 'application/vnd.pagerduty+json;version=2',
		},
		method,
		body,
		qs: query,
		uri: uri || `https://api.pagerduty.com${resource}`,
		json: true,
		qsStringifyOptions: {
			arrayFormat: 'brackets',
		},
	};

	if (!Object.keys(body as IDataObject).length) {
		delete options.form;
	}
	if (!Object.keys(query).length) {
		delete options.qs;
	}

	options.headers = Object.assign({}, options.headers, headers);

	try {
		if (authenticationMethod === 'apiToken') {
			const credentials = await this.getCredentials('pagerDutyApi');

			options.headers.Authorization = `Token token=${credentials.apiToken}`;

			return await this.helpers.request(options);
		} else {
			return await this.helpers.requestOAuth2.call(this, 'pagerDutyOAuth2Api', options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function pagerDutyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.limit = 100;
	query.offset = 0;

	do {
		responseData = await pagerDutyApiRequest.call(this, method, endpoint, body, query);
		query.offset++;
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
	} while (responseData.more);

	return returnData;
}

export function keysToSnakeCase(elements: IDataObject[] | IDataObject): IDataObject[] {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	for (const element of elements) {
		for (const key of Object.keys(element)) {
			if (key !== snakeCase(key)) {
				element[snakeCase(key)] = element[key];
				delete element[key];
			}
		}
	}
	return elements;
}
