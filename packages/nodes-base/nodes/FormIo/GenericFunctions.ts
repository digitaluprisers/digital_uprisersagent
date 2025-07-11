import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'Digital Uprisers-workflow';
import { ApplicationError, NodeApiError } from 'Digital Uprisers-workflow';

interface IFormIoCredentials {
	environment: 'cloudHosted' | ' selfHosted';
	domain?: string;
	email: string;
	password: string;
}

/**
 * Method has the logic to get jwt token from Form.io
 */
async function getToken(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	credentials: IFormIoCredentials,
) {
	const base = credentials.domain || 'https://formio.form.io';
	const options = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: {
			data: {
				email: credentials.email,
				password: credentials.password,
			},
		},
		uri: `${base}/user/login`,
		json: true,
		resolveWithFullResponse: true,
	} satisfies IRequestOptions;

	try {
		const responseObject = await this.helpers.request(options);
		return responseObject.headers['x-jwt-token'];
	} catch (error) {
		throw new ApplicationError(
			'Authentication Failed for Form.io. Please provide valid credentails/ endpoint details',
			{ level: 'warning' },
		);
	}
}

/**
 * Method will call register or list webhooks based on the passed method in the parameter
 */
export async function formIoApiRequest(
	this: IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body = {},
	qs = {},
): Promise<any> {
	const credentials = await this.getCredentials<IFormIoCredentials>('formIoApi');

	const token = await getToken.call(this, credentials);

	const base = credentials.domain || 'https://api.form.io';

	const options = {
		headers: {
			'Content-Type': 'application/json',
			'x-jwt-token': token,
		},
		method,
		body,
		qs,
		uri: `${base}${endpoint}`,
		json: true,
	};

	try {
		return await this.helpers.request.call(this, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
