import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { jsonParse, NodeApiError } from 'Digital Uprisers-workflow';

export async function cockpitApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('cockpitApi');
	let options: IRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs: {
			token: credentials.accessToken,
		},
		body,
		uri: uri || `${credentials.url}/api${resource}`,
		json: true,
	};

	options = Object.assign({}, options, option);

	if (Object.keys(options.body as IDataObject).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function createDataFromParameters(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex: number,
): IDataObject {
	const dataFieldsAreJson = this.getNodeParameter('jsonDataFields', itemIndex) as boolean;

	if (dataFieldsAreJson) {
		// Parameters are defined as JSON
		return jsonParse(this.getNodeParameter('dataFieldsJson', itemIndex, '{}') as string);
	}

	// Parameters are defined in UI
	const uiDataFields = this.getNodeParameter('dataFieldsUi', itemIndex, {}) as IDataObject;
	const unpacked: IDataObject = {};

	if (uiDataFields.field === undefined) {
		return unpacked;
	}

	for (const field of uiDataFields.field as IDataObject[]) {
		unpacked[field.name as string] = field.value;
	}

	return unpacked;
}
