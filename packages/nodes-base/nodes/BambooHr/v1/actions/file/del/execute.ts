import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../../transport';

export async function del(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const body: IDataObject = {};
	const requestMethod = 'DELETE';

	//meta data
	const fileId: string = this.getNodeParameter('fileId', index) as string;

	//endpoint
	const endpoint = `files/${fileId}`;

	//response
	await apiRequest.call(this, requestMethod, endpoint, body);

	//return
	return this.helpers.returnJsonArray({ success: true });
}
