import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../../transport';

export async function getAlert(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('alertId', index) as string;

	const qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = `rmm_alerts/${id}`;
	const body = {} as IDataObject;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
	return this.helpers.returnJsonArray(responseData.rmm_alert as IDataObject[]);
}
