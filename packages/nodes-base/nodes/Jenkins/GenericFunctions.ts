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

export function tolerateTrailingSlash(baseUrl: string) {
	return baseUrl.endsWith('/') ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
}

export async function jenkinsApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	uri: string,
	qs: IDataObject = {},

	body: any = '',
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('jenkinsApi');
	let options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
		},
		method,
		auth: {
			username: credentials.username as string,
			password: credentials.apiKey as string,
		},
		uri: `${tolerateTrailingSlash(credentials.baseUrl as string)}${uri}`,
		json: true,
		qs,
		body,
	};
	options = Object.assign({}, options, option);
	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
