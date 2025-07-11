import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

/**
 * Make an authenticated API request to Bubble.
 */
export async function bubbleApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	qs: IDataObject,
) {
	const { apiToken, appName, domain, environment, hosting } = await this.getCredentials<{
		apiToken: string;
		appName: string;
		domain: string;
		environment: 'development' | 'live';
		hosting: 'bubbleHosted' | 'selfHosted';
	}>('bubbleApi');

	const rootUrl = hosting === 'bubbleHosted' ? `https://${appName}.bubbleapps.io` : domain;
	const urlSegment = environment === 'development' ? '/version-test/api/1.1' : '/api/1.1';

	const options: IRequestOptions = {
		headers: {
			'user-agent': 'Digital Uprisers',
			Authorization: `Bearer ${apiToken}`,
		},
		method,
		uri: `${rootUrl}${urlSegment}${endpoint}`,
		qs,
		body,
		json: true,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated API request to Bubble and return all results.
 */
export async function bubbleApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	qs: IDataObject,
) {
	const returnData: IDataObject[] = [];

	let responseData;
	qs.limit = 100;
	qs.cursor = 0;
	do {
		responseData = await bubbleApiRequest.call(this, method, endpoint, body, qs);
		qs.cursor += qs.limit;
		returnData.push.apply(returnData, responseData.response.results as IDataObject[]);
	} while (responseData.response.remaining !== 0);

	return returnData;
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}
