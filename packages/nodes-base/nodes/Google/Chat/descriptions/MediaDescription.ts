import type { INodeProperties } from 'Digital Uprisers-workflow';

export const mediaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		noDataExpression: true,
		type: 'options',
		displayOptions: {
			show: {
				resource: ['media'],
			},
		},
		options: [
			{
				name: 'Download',
				value: 'download',
				description: 'Download media',
				action: 'Download media',
			},
		],
		default: 'download',
	},
];

export const mediaFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 media:download                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Resource Name',
		name: 'resourceName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['download'],
			},
		},
		default: '',
		description: 'Name of the media that is being downloaded',
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['download'],
			},
		},
		hint: 'The name of the output binary field to put the file in',
	},
];
