import type { INodeProperties, IExecuteFunctions, IDataObject } from 'Digital Uprisers-workflow';

import { updateDisplayOptions } from '../../../../../utils/utilities';
import { reportRLC } from '../../helpers/descriptions';
import { splunkApiJsonRequest } from '../../transport';

const properties: INodeProperties[] = [reportRLC];

const displayOptions = {
	show: {
		resource: ['report'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	// https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D

	const reportId = this.getNodeParameter('reportId', i, '', { extractValue: true }) as string;
	const endpoint = `/services/saved/searches/${reportId}`;

	const returnData = await splunkApiJsonRequest.call(this, 'GET', endpoint);

	return returnData;
}
