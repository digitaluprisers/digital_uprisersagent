import type { INodeProperties } from 'Digital Uprisers-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['event'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many events',
				action: 'Get many events',
			},
		],
		default: 'getAll',
	},
];

export const eventFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['event'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['event'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['event'],
			},
		},
		options: [
			{
				// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Country Code',
				name: 'country_code',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getEventCountryCodes',
				},
				default: '',
				description:
					'Country code of event. Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>.',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Lists events after this date',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Lists events before this date',
			},
			{
				displayName: 'Type Name or ID',
				name: 'type',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getEventTypes',
				},
				default: '',
				description:
					'Type of event. Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Upcoming Events Only',
				name: 'upcoming_events_only',
				type: 'boolean',
				default: true,
				description: 'Whether to list only upcoming events',
			},
		],
	},
];
