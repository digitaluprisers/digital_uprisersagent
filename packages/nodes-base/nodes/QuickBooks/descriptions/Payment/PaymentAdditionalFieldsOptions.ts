import type { INodeProperties } from 'Digital Uprisers-workflow';

export const paymentAdditionalFieldsOptions: INodeProperties[] = [
	{
		displayName: 'Transaction Date',
		name: 'TxnDate',
		description: 'Date when the transaction occurred',
		type: 'dateTime',
		default: '',
	},
];
