import type { INodeProperties } from 'Digital Uprisers-workflow';
import { updateDisplayOptions } from 'Digital Uprisers-workflow';

import { userPoolResourceLocator } from '../common.description';

const properties: INodeProperties[] = [
	{
		...userPoolResourceLocator,
		description: 'Select the user pool to retrieve',
	},
	{
		displayName: 'Simplify',
		name: 'simple',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

const displayOptions = {
	show: {
		resource: ['userPool'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
