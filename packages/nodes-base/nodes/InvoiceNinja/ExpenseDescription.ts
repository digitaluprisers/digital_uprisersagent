import type { INodeProperties } from 'Digital Uprisers-workflow';

export const expenseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['expense'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new expense',
				action: 'Create an expense',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an expense',
				action: 'Delete an expense',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get data of an expense',
				action: 'Get an expense',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get data of many expenses',
				action: 'Get many expenses',
			},
		],
		default: 'create',
	},
];

export const expenseFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 expense:create                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				apiVersion: ['v4'],
				operation: ['create'],
				resource: ['expense'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Client Name or ID',
				name: 'client',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getClients',
				},
				default: '',
			},
			{
				displayName: 'Custom Value 1',
				name: 'customValue1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Custom Value 2',
				name: 'customValue2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Category Name or ID',
				name: 'category',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getExpenseCategories',
				},
				default: '',
			},
			{
				displayName: 'Expense Date',
				name: 'expenseDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Payment Date',
				name: 'paymentDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Payment Type',
				name: 'paymentType',
				type: 'options',
				options: [
					{
						name: 'ACH',
						value: 5,
					},
					{
						name: 'Alipay',
						value: 28,
					},
					{
						name: 'American Express',
						value: 8,
					},
					{
						name: 'Apply Credit',
						value: 1,
					},
					{
						name: 'Bank Transfer',
						value: 2,
					},
					{
						name: 'Bitcoin',
						value: 32,
					},
					{
						name: 'Carte Blanche',
						value: 17,
					},
					{
						name: 'Cash',
						value: 3,
					},
					{
						name: 'Check',
						value: 16,
					},
					{
						name: 'Credit Card Other',
						value: 13,
					},
					{
						name: 'Debit',
						value: 4,
					},
					{
						name: 'Diners Card',
						value: 10,
					},
					{
						name: 'Discover Card',
						value: 9,
					},
					{
						name: 'EuroCard',
						value: 11,
					},
					{
						name: 'GoCardless',
						value: 31,
					},
					{
						name: 'Google Wallet',
						value: 15,
					},
					{
						name: 'iZettle',
						value: 24,
					},
					{
						name: 'JCB',
						value: 19,
					},
					{
						name: 'Laser',
						value: 20,
					},
					{
						name: 'Maestro',
						value: 21,
					},
					{
						name: 'MasterCard',
						value: 7,
					},
					{
						name: 'Money Order',
						value: 27,
					},
					{
						name: 'Nova',
						value: 12,
					},
					{
						name: 'Paypal',
						value: 14,
					},
					{
						name: 'SEPA',
						value: 30,
					},
					{
						name: 'Sofort',
						value: 29,
					},
					{
						name: 'Solo',
						value: 22,
					},
					{
						name: 'Swich',
						value: 23,
					},
					{
						name: 'Swish',
						value: 25,
					},
					{
						name: 'UnionPay',
						value: 18,
					},
					{
						name: 'Venmo',
						value: 26,
					},
					{
						name: 'Visa Card',
						value: 6,
					},
				],
				default: 1,
			},
			{
				displayName: 'Private Notes',
				name: 'privateNotes',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Public Notes',
				name: 'publicNotes',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Name 1',
				name: 'taxName1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Name 2',
				name: 'taxName2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Rate 1',
				name: 'taxRate1',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Tax Rate 2',
				name: 'taxRate2',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Transaction Reference',
				name: 'transactionReference',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Vendor Name or ID',
				name: 'vendor',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getVendors',
				},
				default: '',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				apiVersion: ['v5'],
				operation: ['create'],
				resource: ['expense'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Client Name or ID',
				name: 'client',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getClients',
				},
				default: '',
			},
			{
				displayName: 'Custom Value 1',
				name: 'customValue1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Custom Value 2',
				name: 'customValue2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Category Name or ID',
				name: 'category',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getExpenseCategories',
				},
				default: '',
			},
			{
				displayName: 'Expense Date',
				name: 'expenseDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Payment Date',
				name: 'paymentDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Payment Type',
				name: 'paymentType',
				type: 'options',
				options: [
					{
						name: 'Bank Transfer',
						value: 1,
					},
					{
						name: 'Cash',
						value: 2,
					},
					{
						name: 'ACH',
						value: 4,
					},
					{
						name: 'Visa',
						value: 5,
					},
					{
						name: 'Mastercard',
						value: 6,
					},
					{
						name: 'American Express',
						value: 7,
					},
					{
						name: 'Discover',
						value: 8,
					},
					{
						name: 'Diners',
						value: 9,
					},
					{
						name: 'Eurocard',
						value: 10,
					},
					{
						name: 'Nova',
						value: 11,
					},
					{
						name: 'Credit Card Other',
						value: 12,
					},
					{
						name: 'PayPal',
						value: 13,
					},
					{
						name: 'Check',
						value: 15,
					},
					{
						name: 'Carte Blanche',
						value: 16,
					},
					{
						name: 'UnionPay',
						value: 17,
					},
					{
						name: 'JCB',
						value: 18,
					},
					{
						name: 'Laser',
						value: 19,
					},
					{
						name: 'Maestro',
						value: 20,
					},
					{
						name: 'Solo',
						value: 21,
					},
					{
						name: 'Switch',
						value: 22,
					},
					{
						name: 'Venmo',
						value: 24,
					},
					{
						name: 'Alipay',
						value: 27,
					},
					{
						name: 'Sofort',
						value: 28,
					},
					{
						name: 'SEPA',
						value: 29,
					},
					{
						name: 'GoCardless',
						value: 30,
					},
					{
						name: 'Crypto',
						value: 31,
					},
					{
						name: 'Credit',
						value: 32,
					},
					{
						name: 'Zelle',
						value: 33,
					},
					{
						name: 'Mollie Bank Transfer',
						value: 34,
					},
					{
						name: 'KBC',
						value: 35,
					},
					{
						name: 'Bancontact',
						value: 36,
					},
					{
						name: 'iDEAL',
						value: 37,
					},
					{
						name: 'Hosted Page',
						value: 38,
					},
					{
						name: 'Giropay',
						value: 39,
					},
					{
						name: 'Przelewy24',
						value: 40,
					},
					{
						name: 'EPS',
						value: 41,
					},
					{
						name: 'Direct Debit',
						value: 42,
					},
					{
						name: 'BECS',
						value: 43,
					},
					{
						name: 'ACSS',
						value: 44,
					},
					{
						name: 'Instant Bank Pay',
						value: 45,
					},
					{
						name: 'FPX',
						value: 46,
					},
					{
						name: 'Klarna',
						value: 47,
					},
					{
						name: 'Interac E-Transfer',
						value: 48,
					},
					{
						name: 'BACS',
						value: 49,
					},
					{
						name: 'Stripe Bank Transfer',
						value: 50,
					},
					{
						name: 'Cash App',
						value: 51,
					},
					{
						name: 'Pay Later',
						value: 52,
					},
				],
				default: 1,
			},
			{
				displayName: 'Private Notes',
				name: 'privateNotes',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Public Notes',
				name: 'publicNotes',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Name 1',
				name: 'taxName1',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Name 2',
				name: 'taxName2',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tax Rate 1',
				name: 'taxRate1',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Tax Rate 2',
				name: 'taxRate2',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Transaction Reference',
				name: 'transactionReference',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Vendor Name or ID',
				name: 'vendor',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.digitaluprisers.com/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getVendors',
				},
				default: '',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                 expense:delete                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['delete'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                                  expense:get                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['get'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                                  expense:getAll                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['expense'],
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
				resource: ['expense'],
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
];
