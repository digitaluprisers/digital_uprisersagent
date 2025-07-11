/* eslint-disable Digital Uprisers-nodes-base/node-filename-against-convention */
import { NodeConnectionTypes, type INodeTypeDescription } from 'Digital Uprisers-workflow';

import { blockFields, blockOperations } from '../shared/descriptions/BlockDescription';
import { databaseFields, databaseOperations } from '../shared/descriptions/DatabaseDescription';
import {
	databasePageFields,
	databasePageOperations,
} from '../shared/descriptions/DatabasePageDescription';
import { pageFields, pageOperations } from '../shared/descriptions/PageDescription';
import { userFields, userOperations } from '../shared/descriptions/UserDescription';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Notion',
	name: 'notion',
	icon: { light: 'file:notion.svg', dark: 'file:notion.dark.svg' },
	group: ['output'],
	version: [2, 2.1, 2.2],
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Consume Notion API',
	defaults: {
		name: 'Notion',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	usableAsTool: true,
	credentials: [
		{
			name: 'notionApi',
			required: true,
			// displayOptions: {
			// 	show: {
			// 		authentication: [
			// 			'apiKey',
			// 		],
			// 	},
			// },
		},
		// {
		// 	name: 'notionOAuth2Api',
		// 	required: true,
		// 	displayOptions: {
		// 		show: {
		// 			authentication: [
		// 				'oAuth2',
		// 			],
		// 		},
		// 	},
		// },
	],
	properties: [
		// {
		// 	displayName: 'Authentication',
		// 	name: 'authentication',
		// 	type: 'options',
		// 	options: [
		// 		{
		// 			name: 'API Key',
		// 			value: 'apiKey',
		// 		},
		// 		{
		// 			name: 'OAuth2',
		// 			value: 'oAuth2',
		// 		},
		// 	],
		// 	default: 'apiKey',
		// 	description: 'The resource to operate on.',
		// },
		{
			displayName:
				'In Notion, make sure to <a href="https://www.notion.so/help/add-and-manage-connections-with-the-api" target="_blank">add your connection</a> to the pages you want to access.',
			name: 'notionNotice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '',
			name: 'Credentials',
			type: 'credentials',
			default: '',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Block',
					value: 'block',
				},
				{
					name: 'Database',
					value: 'database',
				},
				{
					name: 'Database Page',
					value: 'databasePage',
				},
				{
					name: 'Page',
					value: 'page',
				},
				{
					name: 'User',
					value: 'user',
				},
			],
			default: 'page',
		},
		...blockOperations,
		...blockFields,
		...databaseOperations,
		...databaseFields,
		...databasePageOperations,
		...databasePageFields,
		...pageOperations,
		...pageFields,
		...userOperations,
		...userFields,
	],
};
