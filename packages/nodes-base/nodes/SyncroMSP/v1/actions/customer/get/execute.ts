import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../../transport';

export async function getCustomer(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('customerId', index) as string;

	const qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = `customers/${id}`;
	const body = {} as IDataObject;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
	return this.helpers.returnJsonArray(responseData.customer as IDataObject);
}
