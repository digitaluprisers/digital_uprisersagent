import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../../transport';

export async function deactive(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const qs = {} as IDataObject;
	const requestMethod = 'DELETE';
	const endpoint = `users/${userId}`;
	const body = {} as IDataObject;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);

	return this.helpers.returnJsonArray(responseData as IDataObject[]);
}
