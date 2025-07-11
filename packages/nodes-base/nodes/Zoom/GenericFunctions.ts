import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function zoomApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: object = {},
	query: IDataObject = {},
	headers: IDataObject | undefined = undefined,
	option: IDataObject = {},
) {
	const authenticationMethod = this.getNodeParameter('authentication', 0, 'accessToken') as string;

	let options: IRequestOptions = {
		method,
		headers: headers || {
			'Content-Type': 'application/json',
		},
		body,
		qs: query,
		uri: `https://api.zoom.us/v2${resource}`,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(body).length === 0) {
		delete options.body;
	}
	if (Object.keys(query).length === 0) {
		delete options.qs;
	}

	try {
		if (authenticationMethod === 'accessToken') {
			return await this.helpers.requestWithAuthentication.call(this, 'zoomApi', options);
		} else {
			return await this.helpers.requestOAuth2.call(this, 'zoomOAuth2Api', options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

async function wait() {
	return await new Promise((resolve, _reject) => {
		setTimeout(() => {
			resolve(true);
		}, 1000);
	});
}

export async function zoomApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
) {
	const returnData: IDataObject[] = [];
	let responseData;
	query.page_number = 0;
	do {
		responseData = await zoomApiRequest.call(this, method, endpoint, body, query);
		query.page_number++;
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
		// zoom free plan rate limit is 1 request/second
		// TODO just wait when the plan is free
		await wait();
	} while (responseData.page_count !== responseData.page_number);

	return returnData;
}
