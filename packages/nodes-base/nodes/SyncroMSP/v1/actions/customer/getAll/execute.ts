import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'Digital Uprisers-workflow';

import { apiRequest, apiRequestAllItems } from '../../../transport';

export async function getAll(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index);
	const filters = this.getNodeParameter('filters', index);

	let qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = 'customers';
	const body = {} as IDataObject;

	if (filters) {
		qs = filters;
		if (qs.businessName) {
			qs.business_name = qs.businessName;
		}
		if (qs.includeDisabled) {
			qs.include_disabled = qs.includeDisabled;
		}
	}

	if (!returnAll) {
		qs.per_page = this.getNodeParameter('limit', index);
	}

	let responseData;
	if (returnAll) {
		responseData = await apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
		return this.helpers.returnJsonArray(responseData);
	} else {
		responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
		return this.helpers.returnJsonArray(responseData.customers as IDataObject[]);
	}
}
