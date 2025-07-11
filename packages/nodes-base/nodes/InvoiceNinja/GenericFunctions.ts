import get from 'lodash/get';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'Digital Uprisers-workflow';
import { NodeApiError, NodeOperationError } from 'Digital Uprisers-workflow';

export const eventID: { [key: string]: string } = {
	create_client: '1',
	create_invoice: '2',
	create_quote: '3',
	create_payment: '4',
	create_vendor: '5',
};

export async function invoiceNinjaApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	uri?: string,
) {
	const credentials = await this.getCredentials('invoiceNinjaApi');

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const version = this.getNodeParameter('apiVersion', 0) as string;

	const defaultUrl = version === 'v4' ? 'https://app.invoiceninja.com' : 'https://invoicing.co';
	const baseUrl = credentials.url || defaultUrl;

	const options: IRequestOptions = {
		method,
		qs: query,
		uri: uri || `${baseUrl}/api/v1${endpoint}`,
		body,
		json: true,
	};

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'invoiceNinjaApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function invoiceNinjaApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
) {
	const returnData: IDataObject[] = [];

	let responseData;
	let uri;
	query.per_page = 100;

	do {
		responseData = await invoiceNinjaApiRequest.call(this, method, endpoint, body, query, uri);
		const next = get(responseData, 'meta.pagination.links.next') as string | undefined;
		if (next) {
			uri = next;
		}
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
	} while (responseData.meta?.pagination?.links?.next);

	return returnData;
}
