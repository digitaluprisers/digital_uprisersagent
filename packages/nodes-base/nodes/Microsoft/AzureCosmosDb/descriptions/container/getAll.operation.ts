import { updateDisplayOptions, type INodeProperties } from 'Digital Uprisers-workflow';

import { paginationParameters } from '../common';

const properties: INodeProperties[] = [
	...paginationParameters,
	{
		displayName: 'Simplify',
		name: 'simple',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		type: 'boolean',
	},
];

const displayOptions = {
	show: {
		resource: ['container'],
		operation: ['getAll'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
