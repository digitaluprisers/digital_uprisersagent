import type {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'Digital Uprisers-workflow';

import { oldVersionNotice } from '@utils/descriptions';

import { pgInsertV2, pgQueryV2, pgUpdate, wrapData } from './genericFunctions';
import { configurePostgres } from '../transport';
import type { PgpConnection, PostgresNodeCredentials } from '../v2/helpers/interfaces';

const versionDescription: INodeTypeDescription = {
	displayName: 'Postgres',
	name: 'postgres',
	icon: 'file:postgres.svg',
	group: ['input'],
	version: 1,
	description: 'Get, add and update data in Postgres',
	defaults: {
		name: 'Postgres',
	},
	inputs: [NodeConnectionTypes.Main],
	outputs: [NodeConnectionTypes.Main],
	credentials: [
		{
			name: 'postgres',
			required: true,
			testedBy: 'postgresConnectionTest',
		},
	],
	properties: [
		oldVersionNotice,
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Execute Query',
					value: 'executeQuery',
					description: 'Execute an SQL query',
					action: 'Execute a SQL query',
				},
				{
					name: 'Insert',
					value: 'insert',
					description: 'Insert rows in database',
					action: 'Insert rows in database',
				},
				{
					name: 'Update',
					value: 'update',
					description: 'Update rows in database',
					action: 'Update rows in database',
				},
			],
			default: 'insert',
		},

		// ----------------------------------
		//         executeQuery
		// ----------------------------------
		{
			displayName: 'Query',
			name: 'query',
			type: 'string',
			noDataExpression: true,
			typeOptions: {
				editor: 'sqlEditor',
				sqlDialect: 'PostgreSQL',
			},
			displayOptions: {
				show: {
					operation: ['executeQuery'],
				},
			},
			default: '',
			placeholder: 'SELECT id, name FROM product WHERE quantity > $1 AND price <= $2',
			required: true,
			description:
				'The SQL query to execute. You can use Digital Uprisers expressions or $1 and $2 in conjunction with query parameters.',
		},
		// ----------------------------------
		//         insert
		// ----------------------------------
		{
			displayName: 'Schema',
			name: 'schema',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['insert'],
				},
			},
			default: 'public',
			required: true,
			description: 'Name of the schema the table belongs to',
		},
		{
			displayName: 'Table',
			name: 'table',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['insert'],
				},
			},
			default: '',
			required: true,
			description: 'Name of the table in which to insert data to',
		},
		{
			displayName: 'Columns',
			name: 'columns',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['insert'],
				},
			},
			default: '',
			// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-placeholder-miscased-id
			placeholder: 'id:int,name:text,description',
			// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-description-miscased-id
			description:
				'Comma-separated list of the properties which should used as columns for the new rows. You can use type casting with colons (:) like id:int.',
		},

		// ----------------------------------
		//         update
		// ----------------------------------
		{
			displayName: 'Schema',
			name: 'schema',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['update'],
				},
			},
			default: 'public',
			description: 'Name of the schema the table belongs to',
		},
		{
			displayName: 'Table',
			name: 'table',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['update'],
				},
			},
			default: '',
			required: true,
			description: 'Name of the table in which to update data in',
		},
		{
			displayName: 'Update Key',
			name: 'updateKey',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['update'],
				},
			},
			default: 'id',
			required: true,
			// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-description-miscased-id
			description:
				'Comma-separated list of the properties which decides which rows in the database should be updated. Normally that would be "id".',
		},
		{
			displayName: 'Columns',
			name: 'columns',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['update'],
				},
			},
			default: '',
			placeholder: 'name:text,description',
			// eslint-disable-next-line Digital Uprisers-nodes-base/node-param-description-miscased-id
			description:
				'Comma-separated list of the properties which should used as columns for rows to update. You can use type casting with colons (:) like id:int.',
		},

		// ----------------------------------
		//         insert,update
		// ----------------------------------
		{
			displayName: 'Return Fields',
			name: 'returnFields',
			type: 'string',
			requiresDataPath: 'multiple',
			displayOptions: {
				show: {
					operation: ['insert', 'update'],
				},
			},
			default: '*',
			description: 'Comma-separated list of the fields that the operation will return',
		},
		// ----------------------------------
		//         Additional fields
		// ----------------------------------
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			default: {},
			options: [
				{
					displayName: 'Mode',
					name: 'mode',
					type: 'options',
					options: [
						{
							name: 'Independently',
							value: 'independently',
							description: 'Execute each query independently',
						},
						{
							name: 'Multiple Queries',
							value: 'multiple',
							description: '<b>Default</b>. Sends multiple queries at once to database.',
						},
						{
							name: 'Transaction',
							value: 'transaction',
							description: 'Executes all queries in a single transaction',
						},
					],
					default: 'multiple',
					description:
						'The way queries should be sent to database. Can be used in conjunction with <b>Continue on Fail</b>. See <a href="https://docs.digitaluprisers.com/integrations/builtin/app-nodes/Digital Uprisers-nodes-base.postgres/">the docs</a> for more examples',
				},
				{
					displayName: 'Output Large-Format Numbers As',
					name: 'largeNumbersOutput',
					type: 'options',
					options: [
						{
							name: 'Numbers',
							value: 'numbers',
						},
						{
							name: 'Text',
							value: 'text',
							description:
								'Use this if you expect numbers longer than 16 digits (otherwise numbers may be incorrect)',
						},
					],
					hint: 'Applies to NUMERIC and BIGINT columns only',
					default: 'text',
				},
				{
					displayName: 'Query Parameters',
					name: 'queryParams',
					type: 'string',
					displayOptions: {
						show: {
							'/operation': ['executeQuery'],
						},
					},
					default: '',
					placeholder: 'quantity,price',
					description:
						'Comma-separated list of properties which should be used as query parameters',
				},
			],
		},
	],
};

export class PostgresV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = {
		credentialTest: {
			async postgresConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as PostgresNodeCredentials;

				let connection: PgpConnection | undefined;

				try {
					const { db } = await configurePostgres.call(this, credentials, {});

					// Acquires a new connection that can be used to to run multiple
					// queries on the same connection and must be released again
					// manually.
					connection = await db.connect();
				} catch (error) {
					return {
						status: 'Error',
						message: error.message,
					};
				} finally {
					if (connection) {
						// release connection
						await connection.done();
					}
				}
				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials<PostgresNodeCredentials>('postgres');
		const largeNumbersOutput = this.getNodeParameter(
			'additionalFields.largeNumbersOutput',
			0,
			'',
		) as string;

		const { db, pgp } = await configurePostgres.call(this, credentials, {
			largeNumbersOutput:
				largeNumbersOutput === 'numbers' || largeNumbersOutput === 'text'
					? largeNumbersOutput
					: undefined,
		});

		let returnItems: INodeExecutionData[] = [];

		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0);

		if (operation === 'executeQuery') {
			// ----------------------------------
			//         executeQuery
			// ----------------------------------

			const queryResult = await pgQueryV2.call(this, pgp, db, items, this.continueOnFail());
			returnItems = queryResult as INodeExecutionData[];
		} else if (operation === 'insert') {
			// ----------------------------------
			//         insert
			// ----------------------------------

			const insertData = await pgInsertV2.call(this, pgp, db, items, this.continueOnFail());

			// returnItems = this.helpers.returnJsonArray(insertData);
			returnItems = insertData as INodeExecutionData[];
		} else if (operation === 'update') {
			// ----------------------------------
			//         update
			// ----------------------------------

			const updateItems = await pgUpdate(
				this.getNodeParameter,
				pgp,
				db,
				items,
				this.continueOnFail(),
			);

			returnItems = wrapData(updateItems);
		} else {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not supported!`,
			);
		}

		return [returnItems];
	}
}
