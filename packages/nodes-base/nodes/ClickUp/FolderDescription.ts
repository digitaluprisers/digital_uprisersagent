import type { INodeProperties } from 'Digital Uprisers-workflow';

export const folderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a folder',
				action: 'Create a folder',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a folder',
				action: 'Delete a folder',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a folder',
				action: 'Get a folder',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many folders',
				action: 'Get many folders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a folder',
				action: 'Update a folder',
			},
		],
		default: 'create',
	},
];

export const folderFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                folder:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['create'],
			},
		},
		required: true,
	},

	/* -------------------------------------------------------------------------- */
	/*                                folder:delete                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['delete'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['delete'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Folder Name or ID',
		name: 'folder',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['delete'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolders',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},

	/* -------------------------------------------------------------------------- */
	/*                                folder:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['get'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['get'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Folder Name or ID',
		name: 'folder',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['get'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolders',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},

	/* -------------------------------------------------------------------------- */
	/*                                folder:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                folder:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Folder Name or ID',
		name: 'folder',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolders',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
		],
	},
];
