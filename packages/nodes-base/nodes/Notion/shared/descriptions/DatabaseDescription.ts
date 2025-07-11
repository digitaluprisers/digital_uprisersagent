import type { INodeProperties } from 'Digital Uprisers-workflow';

import {
	databaseUrlExtractionRegexp,
	databaseUrlValidationRegexp,
	idExtractionRegexp,
	idValidationRegexp,
} from '../constants';

export const databaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['database'],
			},
			hide: {
				'@version': [1],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a database',
				action: 'Get a database',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many databases',
				action: 'Get many databases',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search databases using text search',
				action: 'Search a database',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				'@version': [1],
				resource: ['database'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a database',
				action: 'Get a database',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many databases',
				action: 'Get many databases',
			},
		],
		default: 'get',
	},
];

export const databaseFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                database:get                                */
	/* -------------------------------------------------------------------------- */

	{
		displayName: 'Database',
		name: 'databaseId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'Database',
				name: 'list',
				type: 'list',
				placeholder: 'Select a Database...',
				typeOptions: {
					searchListMethod: 'getDatabases',
					searchable: true,
				},
			},
			{
				displayName: 'Link',
				name: 'url',
				type: 'string',
				placeholder:
					'https://www.notion.so/0fe2f7de558b471eab07e9d871cdf4a9?v=f2d424ba0c404733a3f500c78c881610',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: databaseUrlValidationRegexp,
							errorMessage:
								'Not a valid Notion Database URL. Hint: use the URL of the database itself, not a page containing it.',
						},
					},
				],
				extractValue: {
					type: 'regex',
					regex: databaseUrlExtractionRegexp,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'ab1545b247fb49fa92d6f4b49f4d8116',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: idValidationRegexp,
							errorMessage: 'Not a valid Notion Database ID',
						},
					},
				],
				extractValue: {
					type: 'regex',
					regex: idExtractionRegexp,
				},
				url: '=https://www.notion.so/{{$value.replace(/-/g, "")}}',
			},
		],
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['get'],
			},
		},
		description: 'The Notion Database to get',
	},
	/* -------------------------------------------------------------------------- */
	/*                                database:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['getAll'],
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
				resource: ['database'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Simplify',
		name: 'simple',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['getAll', 'get'],
			},
			hide: {
				'@version': [1],
			},
		},
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	/* -------------------------------------------------------------------------- */
	/*                                database:search                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Text',
		name: 'text',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['search'],
			},
		},
		description: 'The text to search for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['search'],
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
				resource: ['database'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Simplify',
		name: 'simple',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['search'],
			},
		},
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['search'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Sort',
				name: 'sort',
				placeholder: 'Add Sort',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: false,
				},
				default: {},
				options: [
					{
						displayName: 'Sort',
						name: 'sortValue',
						values: [
							{
								displayName: 'Direction',
								name: 'direction',
								type: 'options',
								options: [
									{
										name: 'Ascending',
										value: 'ascending',
									},
									{
										name: 'Descending',
										value: 'descending',
									},
								],
								default: 'descending',
								description: 'The direction to sort',
							},
							{
								displayName: 'Timestamp',
								name: 'timestamp',
								type: 'options',
								options: [
									{
										name: 'Last Edited Time',
										value: 'last_edited_time',
									},
								],
								default: 'last_edited_time',
								description: 'The name of the timestamp to sort against',
							},
						],
					},
				],
			},
		],
	},
];
