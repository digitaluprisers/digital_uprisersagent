import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
} from 'Digital Uprisers-workflow';

export async function ghostApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	const source = this.getNodeParameter('source', 0) as string;

	let version;
	let credentialType;

	if (source === 'contentApi') {
		//https://ghost.org/faq/api-versioning/
		version = 'v3';
		credentialType = 'ghostContentApi';
	} else {
		version = 'v2';
		credentialType = 'ghostAdminApi';
	}

	const credentials = await this.getCredentials(credentialType);

	const options: IRequestOptions = {
		method,
		qs: query,
		uri: uri || `${credentials.url}/ghost/api/${version}${endpoint}`,
		body,
		json: true,
	};

	return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
}

export async function ghostApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	query.limit = 50;
	query.page = 1;

	do {
		responseData = await ghostApiRequest.call(this, method, endpoint, body, query);
		query.page = responseData.meta.pagination.next;
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
	} while (query.page !== null);
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
