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

export async function openThesaurusApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	try {
		let options = {
			headers: {
				'User-Agent': 'https://digitaluprisers.com',
			},
			method,
			qs,
			body,
			uri: uri || `https://www.openthesaurus.de${resource}`,
			json: true,
		} satisfies IRequestOptions;

		options = Object.assign({}, options, option);
		options.qs.format = 'application/json';

		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
