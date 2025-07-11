import type {
	JsonObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IDataObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function paddleApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	endpoint: string,
	method: IHttpRequestMethods,

	body: any = {},
	_query?: IDataObject,
	_uri?: string,
): Promise<any> {
	const credentials = await this.getCredentials('paddleApi');
	const productionUrl = 'https://vendors.paddle.com/api';
	const sandboxUrl = 'https://sandbox-vendors.paddle.com/api';

	const isSandbox = credentials.sandbox;

	const options: IRequestOptions = {
		method,
		headers: {
			'content-type': 'application/json',
		},
		uri: `${isSandbox === true ? sandboxUrl : productionUrl}${endpoint}`,
		body,
		json: true,
	};

	body.vendor_id = credentials.vendorId;
	body.vendor_auth_code = credentials.vendorAuthCode;
	try {
		const response = await this.helpers.request(options);

		if (!response.success) {
			throw new NodeApiError(this.getNode(), response as JsonObject);
		}

		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function paddleApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions,
	propertyName: string,
	endpoint: string,
	method: IHttpRequestMethods,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	body.results_per_page = 200;
	body.page = 1;

	do {
		responseData = await paddleApiRequest.call(this, endpoint, method, body, query);
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
		body.page++;
	} while (
		responseData[propertyName].length !== 0 &&
		responseData[propertyName].length === body.results_per_page
	);

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
