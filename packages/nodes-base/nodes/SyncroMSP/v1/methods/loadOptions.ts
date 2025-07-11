import type { ILoadOptionsFunctions, INodePropertyOptions } from 'Digital Uprisers-workflow';
import { NodeOperationError } from 'Digital Uprisers-workflow';

import { apiRequestAllItems } from '../transport';

// Get all the available channels

export async function getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'customers';
	const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {});

	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	for (const data of responseData) {
		returnData.push({
			name: data.fullname as string,
			value: data.id as number,
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}
