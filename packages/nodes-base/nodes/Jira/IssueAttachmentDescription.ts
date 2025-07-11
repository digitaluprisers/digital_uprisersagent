import type { INodeProperties } from 'Digital Uprisers-workflow';

export const issueAttachmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add attachment to issue',
				action: 'Add an attachment to an issue',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an attachment',
				action: 'Get an attachment from an issue',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many attachments',
				action: 'Get many issue attachments',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove an attachment',
				action: 'Remove an attachment from an issue',
			},
		],
		default: 'add',
	},
];

export const issueAttachmentFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                issueAttachment:add                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Issue Key',
		name: 'issueKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['add'],
			},
		},
		default: '',
	},
	{
		displayName: 'Input Binary Field',
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['add'],
			},
		},
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		hint: 'The name of the input binary field containing the file to be written',
		required: true,
	},

	/* -------------------------------------------------------------------------- */
	/*                                issueAttachment:get                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the attachment',
	},
	{
		displayName: 'Download',
		name: 'download',
		type: 'boolean',
		default: false,
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['get'],
				download: [true],
			},
		},
		hint: 'The name of the output binary field to put the file in',
		required: true,
	},
	/* -------------------------------------------------------------------------- */
	/*                                issueAttachment:getAll                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Issue Key',
		name: 'issueKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['getAll'],
			},
		},
		default: '',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
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
				resource: ['issueAttachment'],
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
		displayName: 'Download',
		name: 'download',
		type: 'boolean',
		default: false,
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Put Output File in Field',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['getAll'],
				download: [true],
			},
		},
		hint: 'The name of the output binary field to put the file in',
		required: true,
	},
	/* -------------------------------------------------------------------------- */
	/*                                issueAttachment:remove                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Attachment ID',
		name: 'attachmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['issueAttachment'],
				operation: ['remove'],
			},
		},
		default: '',
		description: 'The ID of the attachment',
	},
];
