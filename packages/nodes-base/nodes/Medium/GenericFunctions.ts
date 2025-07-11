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

export async function mediumApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0);

	const options: IRequestOptions = {
		method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Charset': 'utf-8',
		},
		qs: query,
		uri: uri || `https://api.medium.com/v1${endpoint}`,
		body,
		json: true,
	};

	try {
		if (authenticationMethod === 'accessToken') {
			const credentials = await this.getCredentials('mediumApi');

			options.headers!.Authorization = `Bearer ${credentials.accessToken}`;

			return await this.helpers.request(options);
		} else {
			return await this.helpers.requestOAuth2.call(this, 'mediumOAuth2Api', options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
