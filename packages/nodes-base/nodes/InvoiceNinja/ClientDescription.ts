import type { INodeProperties } from 'Digital Uprisers-workflow';

export const clientOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['client'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new client',
				action: 'Create a client',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a client',
				action: 'Delete a client',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get data of a client',
				action: 'Get a client',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get data of many clients',
				action: 'Get many clients',
			},
		],
		default: 'create',
	},
];

export const clientFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 client:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['client'],
			},
		},
		options: [
			{
				displayName: 'Client Name',
				name: 'clientName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ID Number',
				name: 'idNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Private Notes',
				name: 'privateNotes',
				type: 'string',
				default: '',
			},
			{
				displayName: 'VAT Number',
				name: 'vatNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Work Phone',
				name: 'workPhone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Billing Address',
		name: 'billingAddressUi',
		placeholder: 'Add Billing Address',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				name: 'billingAddressValue',
				displayName: 'Billing Address',
				values: [
					{
						displayName: 'Street Address',
						name: 'streetAddress',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Apt/Suite',
						name: 'aptSuite',
						type: 'string',
						default: '',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country Code Name or ID',
						name: 'countryCode',
						type: 'options',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getCountryCodes',
						},
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Contacts',
		name: 'contactsUi',
		placeholder: 'Add Contact',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				// TODO: in v2.0, rename to contactsValue
				name: 'contacstValues',
				displayName: 'Contact',
				values: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Shipping Address',
		name: 'shippingAddressUi',
		placeholder: 'Add Shipping Address',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				name: 'shippingAddressValue',
				displayName: 'Shipping Address',
				values: [
					{
						displayName: 'Street Address',
						name: 'streetAddress',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Apt/Suite',
						name: 'aptSuite',
						type: 'string',
						default: '',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country Code Name or ID',
						name: 'countryCode',
						type: 'options',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getCountryCodes',
						},
						default: '',
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                 client:delete                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['delete'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                                  client:get                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['client'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['client'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'options',
				options: [
					{
						name: 'Invoices',
						value: 'invoices',
					},
				],
				default: 'invoices',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                  client:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['client'],
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
				resource: ['client'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 60,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['client'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'options',
				options: [
					{
						name: 'Invoices',
						value: 'invoices',
					},
				],
				default: 'invoices',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Archived',
						value: 'archived',
					},
					{
						name: 'Deleted',
						value: 'deleted',
					},
				],
				default: 'active',
			},
			{
				displayName: 'Created At',
				name: 'createdAt',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Updated At',
				name: 'updatedAt',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Is Deleted',
				name: 'isDeleted',
				type: 'boolean',
				default: false,
			},
		],
	},
];
