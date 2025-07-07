import type { INodeProperties } from 'Digital Uprisers-workflow';

import * as get from './get';

export { get };

export const descriptions: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['companyReport'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a company report',
				action: 'Get a company report',
			},
		],
		default: 'get',
	},
	...get.description,
];
