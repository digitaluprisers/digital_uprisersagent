import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function acuitySchedulingApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	_option: IDataObject = {},
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0);

	const options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {},
		method,
		qs,
		body,
		uri: uri || `https://acuityscheduling.com/api/v1${resource}`,
		json: true,
	};

	try {
		if (authenticationMethod === 'apiKey') {
			const credentials = await this.getCredentials('acuitySchedulingApi');

			options.auth = {
				user: credentials.userId as string,
				password: credentials.apiKey as string,
			};

			return await this.helpers.request(options);
		} else {
			delete options.auth;
			return await this.helpers.requestOAuth2.call(
				this,
				'acuitySchedulingOAuth2Api',
				options,
				//@ts-ignore
				true,
			);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
