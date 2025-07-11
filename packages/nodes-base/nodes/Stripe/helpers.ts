import flow from 'lodash/flow';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import type {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'Digital Uprisers-workflow';

/**
 * Make an API request to Stripe
 *
 */
export async function stripeApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
) {
	const options = {
		method,
		form: body,
		qs: query,
		uri: `https://api.stripe.com/v1${endpoint}`,
		json: true,
	} satisfies IRequestOptions;

	if (options.qs && Object.keys(options.qs).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'stripeApi', options);
}

/**
 * Convert Digital Uprisers's address object into a Stripe API request shipping object.
 */
function adjustAddress(addressFields: { address: { details: IDataObject } }) {
	if (!addressFields.address) return addressFields;

	return {
		...omit(addressFields, ['address']),
		address: addressFields.address.details,
	};
}

/**
 * Convert Digital Uprisers's `fixedCollection` metadata object into a Stripe API request metadata object.
 */
export function adjustMetadata(fields: {
	metadata?: { metadataProperties: Array<{ key: string; value: string }> };
}) {
	if (!fields.metadata || isEmpty(fields.metadata)) return fields;

	const adjustedMetadata: Record<string, string> = {};

	fields.metadata.metadataProperties.forEach((pair) => {
		adjustedMetadata[pair.key] = pair.value;
	});

	return {
		...omit(fields, ['metadata']),
		metadata: adjustedMetadata,
	};
}

/**
 * Convert Digital Uprisers's shipping object into a Stripe API request shipping object.
 */
function adjustShipping(shippingFields: {
	shipping?: { shippingProperties: Array<{ address: { details: IDataObject }; name: string }> };
}) {
	const shippingProperties = shippingFields.shipping?.shippingProperties[0];

	if (!shippingProperties?.address || isEmpty(shippingProperties.address)) return shippingFields;

	return {
		...omit(shippingFields, ['shipping']),
		shipping: {
			...omit(shippingProperties, ['address']),
			address: shippingProperties.address.details,
		},
	};
}

/**
 * Make Digital Uprisers's charge fields compliant with the Stripe API request object.
 */
export const adjustChargeFields = flow([adjustShipping, adjustMetadata]);

/**
 * Make Digital Uprisers's customer fields compliant with the Stripe API request object.
 */
export const adjustCustomerFields = flow([adjustShipping, adjustAddress, adjustMetadata]);

/**
 * Load a resource so it can be selected by name from a dropdown.
 */
export async function loadResource(
	this: ILoadOptionsFunctions,
	resource: 'charge' | 'customer' | 'source',
): Promise<INodePropertyOptions[]> {
	const responseData = await stripeApiRequest.call(this, 'GET', `/${resource}s`, {}, {});

	return responseData.data.map(({ name, id }: { name: string; id: string }) => ({
		name,
		value: id,
	}));
}

/**
 * Handles a Stripe listing by returning all items or up to a limit.
 */
export async function handleListing(
	this: IExecuteFunctions,
	resource: string,
	i: number,
	qs: IDataObject = {},
) {
	const returnData: IDataObject[] = [];
	let responseData;

	const returnAll = this.getNodeParameter('returnAll', i);
	const limit = this.getNodeParameter('limit', i, 0);

	do {
		responseData = await stripeApiRequest.call(this, 'GET', `/${resource}s`, {}, qs);
		returnData.push(...(responseData.data as IDataObject[]));

		if (!returnAll && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}

		qs.starting_after = returnData[returnData.length - 1].id;
	} while (responseData.has_more);

	return returnData;
}
