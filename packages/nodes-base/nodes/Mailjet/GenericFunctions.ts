import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHookFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';

export async function mailjetApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	path: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const resource = this.getNodeParameter('resource', 0);

	let credentialType;

	if (resource === 'email' || this.getNode().type.includes('Trigger')) {
		credentialType = 'mailjetEmailApi';
		const { sandboxMode } = await this.getCredentials<{
			sandboxMode: boolean;
		}>('mailjetEmailApi');

		if (!this.getNode().type.includes('Trigger')) {
			Object.assign(body, { SandboxMode: sandboxMode });
		}
	} else {
		credentialType = 'mailjetSmsApi';
	}

	let options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs,
		body,
		uri: uri || `https://api.mailjet.com${path}`,
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
}

export async function mailjetApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	query.Limit = 1000;
	query.Offset = 0;

	do {
		responseData = await mailjetApiRequest.call(this, method, endpoint, body, query, undefined, {
			resolveWithFullResponse: true,
		});
		returnData.push.apply(returnData, responseData.body as IDataObject[]);
		query.Offset = query.Offset + query.Limit;
	} while (responseData.length !== 0);
	return returnData;
}

export function validateJSON(json: string | undefined): IDataObject | undefined {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}

export interface IMessage {
	From?: { Email?: string; Name?: string };
	Subject?: string;
	To?: IDataObject[];
	Cc?: IDataObject[];
	Bcc?: IDataObject[];
	Variables?: IDataObject;
	TemplateLanguage?: boolean;
	TemplateID?: number;
	HTMLPart?: string;
	TextPart?: string;
	TrackOpens?: string;
	ReplyTo?: IDataObject;
	TrackClicks?: string;
	Priority?: number;
}
