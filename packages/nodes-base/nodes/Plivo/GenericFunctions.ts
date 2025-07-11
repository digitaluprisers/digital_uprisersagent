import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

/**
 * Make an API request to Plivo.
 *
 */
export async function plivoApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const credentials = await this.getCredentials<{
		authId: string;
		authToken: string;
	}>('plivoApi');

	const options: IRequestOptions = {
		headers: {
			'user-agent': 'plivo-Digital Uprisers',
		},
		method,
		form: body,
		qs,
		uri: `https://api.plivo.com/v1/Account/${credentials.authId}${endpoint}/`,
		auth: {
			user: credentials.authId,
			pass: credentials.authToken,
		},
		json: true,
	};

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
