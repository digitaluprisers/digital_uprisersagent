import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodeProperties,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export interface IProduct {
	fields: {
		item?: object[];
	};
}

/**
 * Make an API request to ActiveCampaign
 *
 */
export async function activeCampaignApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
	dataKey?: string,
): Promise<any> {
	const credentials = await this.getCredentials('activeCampaignApi');

	if (query === undefined) {
		query = {};
	}

	const options: IRequestOptions = {
		headers: {},
		method,
		qs: query,
		uri: `${credentials.apiUrl}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length !== 0) {
		options.body = body;
	}

	try {
		const responseData = await this.helpers.requestWithAuthentication.call(
			this,
			'activeCampaignApi',
			options,
		);

		if (responseData.success === false) {
			throw new NodeApiError(this.getNode(), responseData as JsonObject);
		}

		if (dataKey === undefined) {
			return responseData;
		} else {
			return responseData[dataKey] as IDataObject;
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated ActiveCampaign endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export async function activeCampaignApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
	dataKey?: string,
): Promise<any> {
	if (query === undefined) {
		query = {};
	}
	query.limit = 100;
	query.offset = 0;

	const returnData: IDataObject[] = [];

	let responseData;

	let itemsReceived = 0;
	do {
		responseData = await activeCampaignApiRequest.call(this, method, endpoint, body, query);

		if (dataKey === undefined) {
			returnData.push.apply(returnData, responseData as IDataObject[]);
			if (returnData !== undefined) {
				itemsReceived += returnData.length;
			}
		} else {
			returnData.push.apply(returnData, responseData[dataKey] as IDataObject[]);
			if (responseData[dataKey] !== undefined) {
				itemsReceived += responseData[dataKey].length;
			}
		}

		query.offset = itemsReceived;
	} while (responseData.meta?.total !== undefined && responseData.meta.total > itemsReceived);

	return returnData;
}

export function activeCampaignDefaultGetAllProperties(
	resource: string,
	operation: string,
): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: {
				show: {
					operation: [operation],
					resource: [resource],
				},
			},
			default: false,
			description: 'Whether to return all results or only up to a given limit',
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: {
				show: {
					operation: [operation],
					resource: [resource],
					returnAll: [false],
				},
			},
			typeOptions: {
				minValue: 1,
				maxValue: 500,
			},
			default: 100,
			description: 'Max number of results to return',
		},
		{
			displayName: 'Simplify',
			name: 'simple',
			type: 'boolean',
			displayOptions: {
				show: {
					operation: [operation],
					resource: [resource],
				},
			},
			default: true,
			description: 'Whether to return a simplified version of the response instead of the raw data',
		},
	];
}
