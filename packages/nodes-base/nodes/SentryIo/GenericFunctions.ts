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

export async function sentryIoApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const authentication = this.getNodeParameter('authentication', 0);

	const version = this.getNodeParameter('sentryVersion', 0);

	const options = {
		headers: {},
		method,
		qs,
		body,
		uri: uri || `https://sentry.io${resource}`,
		json: true,
	} satisfies IRequestOptions;
	if (!Object.keys(body as IDataObject).length) {
		delete options.body;
	}

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (options.qs.limit) {
		delete options.qs.limit;
	}

	let credentialName;

	try {
		if (authentication === 'accessToken') {
			if (version === 'cloud') {
				credentialName = 'sentryIoApi';
			} else {
				credentialName = 'sentryIoServerApi';
			}

			const credentials = await this.getCredentials(credentialName);

			if (credentials.url) {
				options.uri = `${credentials?.url}${resource}`;
			}

			options.headers = {
				Authorization: `Bearer ${credentials?.token}`,
			};

			return await this.helpers.request(options);
		} else {
			return await this.helpers.requestOAuth2.call(this, 'sentryIoOAuth2Api', options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

function getNext(link: string) {
	if (link === undefined) {
		return;
	}
	const next = link.split(',')[1];
	if (next.includes('rel="next"')) {
		return next.split(';')[0].replace('<', '').replace('>', '').trim();
	}
}

function hasMore(link: string) {
	if (link === undefined) {
		return;
	}
	const next = link.split(',')[1];
	if (next.includes('rel="next"')) {
		return next.includes('results="true"');
	}
}

export async function sentryApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	let link;

	let uri: string | undefined;

	do {
		responseData = await sentryIoApiRequest.call(this, method, resource, body, query, uri, {
			resolveWithFullResponse: true,
		});
		link = responseData.headers.link;
		uri = getNext(link as string);
		returnData.push.apply(returnData, responseData.body as IDataObject[]);
		const limit = query.limit as number | undefined;
		if (limit && limit >= returnData.length) {
			return;
		}
	} while (hasMore(link as string));

	return returnData;
}
