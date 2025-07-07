import type { INodeProperties } from 'Digital Uprisers-workflow';

export const pushFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['push'],
			},
		},
		placeholder: 'Add option',
		default: {},
		options: [
			{
				displayName: 'Target Repository',
				name: 'targetRepository',
				type: 'string',
				default: '',
				placeholder: 'https://github.com/digitaluprisers.com/Digital Uprisers',
				description: 'The URL or path of the repository to push to',
			},
		],
	},
];
