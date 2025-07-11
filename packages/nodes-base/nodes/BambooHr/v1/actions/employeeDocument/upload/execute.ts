import type { IDataObject, IExecuteFunctions } from 'Digital Uprisers-workflow';

import { apiRequest } from '../../../transport';

export async function upload(this: IExecuteFunctions, index: number) {
	let body: IDataObject = {};
	const requestMethod = 'POST';

	const id: string = this.getNodeParameter('employeeId', index) as string;
	const category = this.getNodeParameter('categoryId', index) as string;
	const options = this.getNodeParameter('options', index);
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index);
	const { fileName, mimeType } = this.helpers.assertBinaryData(index, binaryPropertyName);
	const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

	body = {
		json: false,
		formData: {
			file: {
				value: binaryDataBuffer,
				options: {
					filename: fileName,
					contentType: mimeType,
				},
			},
			fileName,
			category,
		},
		resolveWithFullResponse: true,
	};

	if (options.hasOwnProperty('share') && body.formData) {
		Object.assign(body.formData, options.share ? { share: 'yes' } : { share: 'no' });
	}
	//endpoint
	const endpoint = `employees/${id}/files`;
	const { headers } = await apiRequest.call(this, requestMethod, endpoint, {}, {}, body);
	return this.helpers.returnJsonArray({ fileId: headers.location.split('/').pop() });
}
