import type { IExecuteFunctions, INodeProperties } from 'Digital Uprisers-workflow';

import { updateDisplayOptions } from '@utils/utilities';

import { contactRLC } from '../../descriptions';
import { microsoftApiRequest } from '../../transport';

export const properties: INodeProperties[] = [contactRLC];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['delete'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, index: number) {
	const contactId = this.getNodeParameter('contactId', index, undefined, {
		extractValue: true,
	}) as string;
	await microsoftApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ success: true }),
		{ itemData: { item: index } },
	);

	return executionData;
}
