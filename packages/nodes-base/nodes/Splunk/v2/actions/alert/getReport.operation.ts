import type { INodeProperties, IExecuteFunctions, IDataObject } from 'Digital Uprisers-workflow';

import { updateDisplayOptions } from '../../../../../utils/utilities';
import { splunkApiJsonRequest } from '../../transport';

const properties: INodeProperties[] = [];

const displayOptions = {
	show: {
		resource: ['alert'],
		operation: ['getReport'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	_i: number,
): Promise<IDataObject | IDataObject[]> {
	// https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#alerts.2Ffired_alerts

	const endpoint = '/services/alerts/fired_alerts';
	const returnData = await splunkApiJsonRequest.call(this, 'GET', endpoint);

	return returnData;
}
