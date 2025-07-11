import get from 'lodash/get';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
	JsonObject,
	IHttpRequestMethods,
} from 'Digital Uprisers-workflow';
import { jsonParse, NodeApiError } from 'Digital Uprisers-workflow';

export async function awsApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	service: string,
	method: IHttpRequestMethods,
	path: string,
	body?: string | Buffer,
	query: IDataObject = {},
	headers?: object,
): Promise<any> {
	const credentials = await this.getCredentials('aws');

	const requestOptions = {
		qs: {
			service,
			path,
			...query,
		},
		headers,
		method,
		url: '',
		body,
		region: credentials?.region as string,
	} as IHttpRequestOptions;

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'aws', requestOptions);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function awsApiRequestREST(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	service: string,
	method: IHttpRequestMethods,
	path: string,
	body?: string,
	query: IDataObject = {},
	headers?: object,
): Promise<any> {
	const response = await awsApiRequest.call(this, service, method, path, body, query, headers);
	try {
		return JSON.parse(response as string);
	} catch (e) {
		return response;
	}
}

export async function awsApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	service: string,
	method: IHttpRequestMethods,
	path: string,
	body?: string,
	query: IDataObject = {},
	headers: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await awsApiRequestREST.call(this, service, method, path, body, query, headers);
		if (responseData.NextToken) {
			const data = jsonParse<any>(body as string, {
				errorMessage: 'Response body is not valid JSON',
			});
			data.NextToken = responseData.NextToken;
		}
		returnData.push.apply(returnData, get(responseData, propertyName) as IDataObject[]);
	} while (responseData.NextToken !== undefined);

	return returnData;
}
