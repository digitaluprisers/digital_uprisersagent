import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHookFunctions,
	JsonObject,
	IRequestOptions,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function kitemakerRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	body: IDataObject = {},
) {
	const { personalAccessToken } = await this.getCredentials<{
		personalAccessToken: string;
	}>('kitemakerApi');

	const options = {
		headers: {
			Authorization: `Bearer ${personalAccessToken}`,
		},
		method: 'POST',
		body,
		uri: 'https://toil.kitemaker.co/developers/graphql',
		json: true,
	} satisfies IRequestOptions;

	const responseData = await this.helpers.request.call(this, options);

	if (responseData.errors) {
		throw new NodeApiError(this.getNode(), responseData as JsonObject);
	}

	return responseData;
}

function getGroupAndItems(resource: 'space' | 'user' | 'workItem') {
	const map: { [key: string]: { [key: string]: string } } = {
		space: { group: 'organization', items: 'spaces' },
		user: { group: 'organization', items: 'users' },
		workItem: { group: 'workItems', items: 'workItems' },
	};

	return [map[resource].group, map[resource].items];
}

export async function kitemakerRequestAllItems(
	this: IExecuteFunctions,
	body: { query: string; variables: { [key: string]: string } },
) {
	const resource = this.getNodeParameter('resource', 0) as 'space' | 'user' | 'workItem';
	const [group, items] = getGroupAndItems(resource);

	const returnAll = this.getNodeParameter('returnAll', 0, false);
	const limit = this.getNodeParameter('limit', 0, 0);

	const returnData: IDataObject[] = [];
	let responseData;

	do {
		responseData = await kitemakerRequest.call(this, body);
		body.variables.cursor = responseData.data[group].cursor;
		returnData.push(...(responseData.data[group][items] as IDataObject[]));

		if (!returnAll && returnData.length > limit) {
			return returnData.slice(0, limit);
		}
	} while (responseData.data[group].hasMore);

	return returnData;
}

export type LoadOptions = { name?: string; username?: string; title?: string; id: string };
export function createLoadOptions(
	resources: LoadOptions[],
): Array<{ name: string; value: string }> {
	return resources.map((option) => {
		if (option.username) return { name: option.username, value: option.id };
		if (option.title) return { name: option.title, value: option.id };
		return { name: option.name ?? 'Unnamed', value: option.id };
	});
}
