import type { INodeProperties } from 'Digital Uprisers-workflow';
import { updateDisplayOptions } from 'Digital Uprisers-workflow';

import { validatePath } from '../../helpers/utils';
import { pathParameter, userLocator, userNameParameter } from '../common';

const properties: INodeProperties[] = [
	{
		...userLocator,
		description: 'Select the user you want to update',
	},
	{
		...userNameParameter,
		description: 'The new name of the user',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				...pathParameter,
				placeholder: 'e.g. /division_abc/subdivision_xyz/',
				routing: {
					send: {
						preSend: [validatePath],
						property: 'NewPath',
						type: 'query',
					},
				},
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['update'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
