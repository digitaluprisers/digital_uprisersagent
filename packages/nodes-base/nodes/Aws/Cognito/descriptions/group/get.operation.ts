import type { INodeProperties } from 'Digital Uprisers-workflow';
import { updateDisplayOptions } from 'Digital Uprisers-workflow';

import { groupResourceLocator, userPoolResourceLocator } from '../common.description';

const properties: INodeProperties[] = [
	{
		...userPoolResourceLocator,
		description: 'Select the user pool to use',
	},
	{
		...groupResourceLocator,
		description: 'Select the group you want to retrieve',
	},
	{
		displayName: 'Include Users',
		name: 'includeUsers',
		type: 'boolean',
		default: false,
		description: 'Whether to include a list of users in the group',
	},
];

const displayOptions = {
	show: {
		resource: ['group'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
