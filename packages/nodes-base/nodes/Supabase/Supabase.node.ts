import type {
	IExecuteFunctions,
	ICredentialDataDecryptedObject,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'Digital Uprisers-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'Digital Uprisers-workflow';

import {
	buildGetQuery,
	buildOrQuery,
	buildQuery,
	mapPairedItemsFrom,
	supabaseApiRequest,
	validateCredentials,
} from './GenericFunctions';
import { rowFields, rowOperations } from './RowDescription';

export type FieldsUiValues = Array<{
	fieldId: string;
	fieldValue: string;
}>;

export class Supabase implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Supabase',
		name: 'supabase',
		icon: 'file:supabase.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Add, get, delete and update data in a table',
		defaults: {
			name: 'Supabase',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'supabaseApi',
				required: true,
				testedBy: 'supabaseApiCredentialTest',
			},
		],
		properties: [
			{
				displayName: 'Use Custom Schema',
				name: 'useCustomSchema',
				type: 'boolean',
				default: false,
				noDataExpression: true,
				description:
					'Whether to use a database schema different from the default "public" schema (requires schema exposure in the <a href="https://supabase.com/docs/guides/api/using-custom-schemas?queryGroups=language&language=curl#exposing-custom-schemas">Supabase API</a>)',
			},
			{
				displayName: 'Schema',
				name: 'schema',
				type: 'string',
				default: 'public',
				description: 'Name of database schema to use for table',
				noDataExpression: false,
				displayOptions: { show: { useCustomSchema: [true] } },
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Row',
						value: 'row',
					},
				],
				default: 'row',
			},
			...rowOperations,
			...rowFields,
		],
	};

	methods = {
		loadOptions: {
			async getTables(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { paths } = await supabaseApiRequest.call(this, 'GET', '/');
				for (const path of Object.keys(paths as IDataObject)) {
					//omit introspection path
					if (path === '/') continue;
					returnData.push({
						name: path.replace('/', ''),
						value: path.replace('/', ''),
					});
				}
				return returnData;
			},
			async getTableColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const tableName = this.getCurrentNodeParameter('tableId') as string;
				const { definitions } = await supabaseApiRequest.call(this, 'GET', '/');
				for (const column of Object.keys(definitions[tableName].properties as IDataObject)) {
					returnData.push({
						name: `${column} - (${definitions[tableName].properties[column].type})`,
						value: column,
					});
				}
				return returnData;
			},
		},
		credentialTest: {
			async supabaseApiCredentialTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				try {
					await validateCredentials.call(this, credential.data as ICredentialDataDecryptedObject);
				} catch (error) {
					return {
						status: 'Error',
						message: 'The Service Key is invalid',
					};
				}

				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let qs: IDataObject = {};
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		if (resource === 'row') {
			const tableId = this.getNodeParameter('tableId', 0) as string;

			if (operation === 'create') {
				const records: IDataObject[] = [];

				for (let i = 0; i < length; i++) {
					const record: IDataObject = {};
					const dataToSend = this.getNodeParameter('dataToSend', 0) as
						| 'defineBelow'
						| 'autoMapInputData';

					if (dataToSend === 'autoMapInputData') {
						const incomingKeys = Object.keys(items[i].json);
						const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i) as string;
						const inputDataToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());

						for (const key of incomingKeys) {
							if (inputDataToIgnore.includes(key)) continue;
							record[key] = items[i].json[key];
						}
					} else {
						const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []) as FieldsUiValues;
						for (const field of fields) {
							record[`${field.fieldId}`] = field.fieldValue;
						}
					}
					records.push(record);
				}
				const endpoint = `/${tableId}`;

				try {
					const createdRows: IDataObject[] = await supabaseApiRequest.call(
						this,
						'POST',
						endpoint,
						records,
					);
					createdRows.forEach((row, i) => {
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(row),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					});
				} catch (error) {
					if (this.continueOnFail()) {
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ error: error.description }),
							{ itemData: mapPairedItemsFrom(records) },
						);
						returnData.push(...executionData);
					} else {
						throw error;
					}
				}
			}

			if (operation === 'delete') {
				const filterType = this.getNodeParameter('filterType', 0) as string;
				for (let i = 0; i < length; i++) {
					let endpoint = `/${tableId}`;
					if (filterType === 'manual') {
						const matchType = this.getNodeParameter('matchType', 0) as string;
						const keys = this.getNodeParameter('filters.conditions', i, []) as IDataObject[];

						if (!keys.length) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one select condition must be defined',
								{ itemIndex: i },
							);
						}

						if (matchType === 'allFilters') {
							const data = keys.reduce((obj, value) => buildQuery(obj, value), {});
							Object.assign(qs, data);
						}
						if (matchType === 'anyFilter') {
							const data = keys.map((key) => buildOrQuery(key));
							Object.assign(qs, { or: `(${data.join(',')})` });
						}
					}

					if (filterType === 'string') {
						const filterString = this.getNodeParameter('filterString', i) as string;
						endpoint = `${endpoint}?${encodeURI(filterString)}`;
					}

					let rows;

					try {
						rows = await supabaseApiRequest.call(this, 'DELETE', endpoint, {}, qs);
					} catch (error) {
						if (this.continueOnFail()) {
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray({ error: error.description }),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);

							continue;
						}
						throw error;
					}
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(rows as IDataObject[]),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			}

			if (operation === 'get') {
				const endpoint = `/${tableId}`;

				for (let i = 0; i < length; i++) {
					const keys = this.getNodeParameter('filters.conditions', i, []) as IDataObject[];
					const data = keys.reduce((obj, value) => buildGetQuery(obj, value), {});
					Object.assign(qs, data);
					let rows;

					if (!keys.length) {
						throw new NodeOperationError(
							this.getNode(),
							'At least one select condition must be defined',
							{ itemIndex: i },
						);
					}

					try {
						rows = await supabaseApiRequest.call(this, 'GET', endpoint, {}, qs);
					} catch (error) {
						if (this.continueOnFail()) {
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray({ error: error.message }),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);

							continue;
						}
						throw error;
					}
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(rows as IDataObject[]),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			}

			if (operation === 'getAll') {
				const returnAll = this.getNodeParameter('returnAll', 0);
				const filterType = this.getNodeParameter('filterType', 0) as string;

				let endpoint = `/${tableId}`;
				for (let i = 0; i < length; i++) {
					qs = {}; // reset qs

					if (filterType === 'manual') {
						const matchType = this.getNodeParameter('matchType', 0) as string;
						const keys = this.getNodeParameter('filters.conditions', i, []) as IDataObject[];

						if (keys.length !== 0) {
							if (matchType === 'allFilters') {
								const data = keys.map((key) => buildOrQuery(key));
								Object.assign(qs, { and: `(${data.join(',')})` });
							}
							if (matchType === 'anyFilter') {
								const data = keys.map((key) => buildOrQuery(key));
								Object.assign(qs, { or: `(${data.join(',')})` });
							}
						}
					}

					if (filterType === 'string') {
						const filterString = this.getNodeParameter('filterString', i) as string;
						endpoint = `${endpoint}?${encodeURI(filterString)}`;
					}

					if (!returnAll) {
						qs.limit = this.getNodeParameter('limit', 0);
					}

					let rows: IDataObject[] = [];

					try {
						let responseLength = 0;
						do {
							const newRows = await supabaseApiRequest.call(this, 'GET', endpoint, {}, qs);
							responseLength = newRows.length;
							rows = rows.concat(newRows);
							qs.offset = rows.length;
						} while (responseLength >= 1000);
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(rows),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					} catch (error) {
						if (this.continueOnFail()) {
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray({ error: error.description }),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);

							continue;
						}
						throw error;
					}
				}
			}

			if (operation === 'update') {
				const filterType = this.getNodeParameter('filterType', 0) as string;
				let endpoint = `/${tableId}`;
				for (let i = 0; i < length; i++) {
					if (filterType === 'manual') {
						const matchType = this.getNodeParameter('matchType', 0) as string;
						const keys = this.getNodeParameter('filters.conditions', i, []) as IDataObject[];

						if (!keys.length) {
							throw new NodeOperationError(
								this.getNode(),
								'At least one select condition must be defined',
								{ itemIndex: i },
							);
						}

						if (matchType === 'allFilters') {
							const data = keys.reduce((obj, value) => buildQuery(obj, value), {});
							Object.assign(qs, data);
						}
						if (matchType === 'anyFilter') {
							const data = keys.map((key) => buildOrQuery(key));
							Object.assign(qs, { or: `(${data.join(',')})` });
						}
					}

					if (filterType === 'string') {
						const filterString = this.getNodeParameter('filterString', i) as string;
						endpoint = `${endpoint}?${encodeURI(filterString)}`;
					}

					const record: IDataObject = {};
					const dataToSend = this.getNodeParameter('dataToSend', 0) as
						| 'defineBelow'
						| 'autoMapInputData';

					if (dataToSend === 'autoMapInputData') {
						const incomingKeys = Object.keys(items[i].json);
						const rawInputsToIgnore = this.getNodeParameter('inputsToIgnore', i) as string;
						const inputDataToIgnore = rawInputsToIgnore.split(',').map((c) => c.trim());

						for (const key of incomingKeys) {
							if (inputDataToIgnore.includes(key)) continue;
							record[key] = items[i].json[key];
						}
					} else {
						const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []) as FieldsUiValues;
						for (const field of fields) {
							record[`${field.fieldId}`] = field.fieldValue;
						}
					}
					let updatedRow;

					try {
						updatedRow = await supabaseApiRequest.call(this, 'PATCH', endpoint, record, qs);
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(updatedRow as IDataObject[]),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					} catch (error) {
						if (this.continueOnFail()) {
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray({ error: error.description }),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);
							continue;
						}
						throw error;
					}
				}
			}
		}
		return [returnData];
	}
}
