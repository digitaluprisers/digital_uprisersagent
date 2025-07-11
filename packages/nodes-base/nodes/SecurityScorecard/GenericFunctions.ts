import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function scorecardApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('securityScorecardApi');

	const headerWithAuthentication = { Authorization: `Token ${credentials.apiKey}` };

	let options: IRequestOptions = {
		headers: headerWithAuthentication,
		method,
		qs: query,
		uri: uri || `https://api.securityscorecard.io/${resource}`,
		body,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (Object.keys(body as IDataObject).length === 0) {
		delete options.body;
	}

	if (Object.keys(query).length === 0) {
		delete options.qs;
	}
	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function simplify(data: IDataObject[]) {
	const results = [];
	for (const record of data) {
		const newRecord: IDataObject = { date: record.date };
		for (const factor of record.factors as IDataObject[]) {
			newRecord[factor.name as string] = factor.score;
		}
		results.push(newRecord);
	}
	return results;
}
