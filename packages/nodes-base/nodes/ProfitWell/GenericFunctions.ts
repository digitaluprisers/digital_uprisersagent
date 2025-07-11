import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function profitWellApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	try {
		const credentials = await this.getCredentials('profitWellApi');
		let options: IRequestOptions = {
			headers: {
				Authorization: credentials.accessToken,
			},
			method,
			qs,
			body,
			uri: uri || `https://api.profitwell.com/v2${resource}`,
			json: true,
		};

		options = Object.assign({}, options, option);

		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
export type Metrics = {
	[key: string]: [{ date: string; value: number | null }];
};
export function simplifyDailyMetrics(responseData: Metrics) {
	const data: IDataObject[] = [];
	const keys = Object.keys(responseData);
	const dates = responseData[keys[0]].map((e) => e.date);
	for (const [index, date] of dates.entries()) {
		const element: IDataObject = {
			date,
		};
		for (const key of keys) {
			element[key] = responseData[key][index].value;
		}
		data.push(element);
	}
	return data;
}

export function simplifyMontlyMetrics(responseData: Metrics) {
	const data: IDataObject = {};
	for (const key of Object.keys(responseData)) {
		for (const [index] of responseData[key].entries()) {
			data[key] = responseData[key][index].value;
			data.date = responseData[key][index].date;
		}
	}
	return data;
}
