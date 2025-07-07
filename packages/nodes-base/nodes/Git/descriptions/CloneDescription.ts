import type { INodeProperties } from 'Digital Uprisers-workflow';

export const cloneFields: INodeProperties[] = [
	{
		displayName: 'Source Repository',
		name: 'sourceRepository',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['clone'],
			},
		},
		default: '',
		placeholder: 'https://github.com/digitaluprisers.com/Digital Uprisers',
		description: 'The URL or path of the repository to clone',
		required: true,
	},
];
