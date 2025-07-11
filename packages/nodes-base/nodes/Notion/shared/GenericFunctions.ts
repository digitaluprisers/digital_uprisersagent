import { camelCase, capitalCase, snakeCase } from 'change-case';
import set from 'lodash/set';
import moment from 'moment-timezone';
import type {
	IBinaryKeyData,
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	INode,
	INodeExecutionData,
	INodeParameterResourceLocator,
	INodeProperties,
	IPairedItemData,
	IPollFunctions,
	IRequestOptions,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { NodeApiError, NodeOperationError } from 'Digital Uprisers-workflow';
import { validate as uuidValidate } from 'uuid';

import { blockUrlExtractionRegexp, databasePageUrlValidationRegexp } from './constants';
import { filters } from './descriptions/Filters';

function uuidValidateWithoutDashes(this: IExecuteFunctions, value: string) {
	if (uuidValidate(value)) return true;
	if (value.length == 32) {
		const strWithDashes = `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
		if (uuidValidate(strWithDashes)) return true;
	}
	throw new NodeOperationError(
		this.getNode(),
		`The relation id "${value}" is not a valid uuid with optional dashes.`,
	);
}

export type SortData = { key: string; type: string; direction: string; timestamp: boolean };

const apiVersion: { [key: number]: string } = {
	1: '2021-05-13',
	2: '2021-08-16',
	2.1: '2021-08-16',
	2.2: '2021-08-16',
};

export async function notionApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	try {
		let options: IRequestOptions = {
			headers: {
				'Notion-Version': apiVersion[this.getNode().typeVersion],
			},
			method,
			qs,
			body,
			uri: uri || `https://api.notion.com/v1${resource}`,
			json: true,
		};
		options = Object.assign({}, options, option);
		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}
		if (!uri) {
			return await this.helpers.requestWithAuthentication.call(this, 'notionApi', options);
		}
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function notionApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: any = {},
	query: IDataObject = {},
): Promise<any> {
	const resource = this.getNodeParameter('resource', 0);

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await notionApiRequest.call(this, method, endpoint, body, query);
		const { next_cursor } = responseData;
		if (resource === 'block' || resource === 'user') {
			query.start_cursor = next_cursor;
		} else {
			body.start_cursor = next_cursor;
		}
		returnData.push.apply(returnData, responseData[propertyName] as IDataObject[]);
		const limit = query.limit as number | undefined;
		if (limit && limit <= returnData.length) {
			return returnData;
		}
	} while (responseData.has_more !== false);

	return returnData;
}

export async function notionApiRequestGetBlockChildrens(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	blocks: IDataObject[],
	responseData: IDataObject[] = [],
	limit?: number,
) {
	if (blocks.length === 0) return responseData;

	for (const block of blocks) {
		responseData.push(block);

		if (block.type === 'child_page') continue;

		if (block.has_children) {
			let childrens = await notionApiRequestAllItems.call(
				this,
				'results',
				'GET',
				`/blocks/${block.id}/children`,
			);

			childrens = (childrens || []).map((entry: IDataObject) => ({
				object: entry.object,
				parent_id: block.id,
				...entry,
			}));

			await notionApiRequestGetBlockChildrens.call(this, childrens, responseData);
		}

		if (limit && responseData.length === limit) {
			return responseData;
		}

		if (limit && responseData.length > limit) {
			return responseData.slice(0, limit);
		}
	}

	return responseData;
}

export function getBlockTypesOptions() {
	return [
		{
			name: 'Paragraph',
			value: 'paragraph',
		},
		{
			name: 'Heading 1',
			value: 'heading_1',
		},
		{
			name: 'Heading 2',
			value: 'heading_2',
		},
		{
			name: 'Heading 3',
			value: 'heading_3',
		},
		{
			name: 'Toggle',
			value: 'toggle',
		},
		{
			name: 'To-Do',
			value: 'to_do',
		},
		// {
		// 	name: 'Child Page',
		// 	value: 'child_page',
		// },
		{
			name: 'Bulleted List Item',
			value: 'bulleted_list_item',
		},
		{
			name: 'Numbered List Item',
			value: 'numbered_list_item',
		},
		{
			name: 'Image',
			value: 'image',
		},
	];
}

function textContent(content: string) {
	return {
		text: {
			content,
		},
	};
}

export function formatTitle(content: string) {
	return {
		title: [textContent(content)],
	};
}

export function formatText(content: string) {
	return {
		text: [textContent(content)],
	};
}

function getLink(text: { textLink: string; isLink: boolean }) {
	if (text.isLink && text.textLink !== '') {
		return {
			link: {
				url: text.textLink,
			},
		};
	}
	return {};
}

type TextData = {
	textType: string;
	text: string;
	isLink: boolean;
	range: boolean;
	textLink: string;
	mentionType: string;
	dateStart: string;
	dateEnd: string;
	date: string;
	annotationUi: IDataObject;
	expression: string;
};
function getTexts(texts: TextData[]) {
	const results = [];
	for (const text of texts) {
		if (text.textType === 'text') {
			results.push({
				type: 'text',
				text: {
					content: text.text,
					...getLink(text),
				},
				annotations: text.annotationUi,
			});
		} else if (text.textType === 'mention') {
			if (text.mentionType === 'date') {
				results.push({
					type: 'mention',
					mention: {
						type: text.mentionType,
						[text.mentionType]: text.range
							? { start: text.dateStart, end: text.dateEnd }
							: { start: text.date, end: null },
					},
					annotations: text.annotationUi,
				});
			} else {
				results.push({
					type: 'mention',
					mention: {
						type: text.mentionType,
						[text.mentionType]: { id: text[text.mentionType as keyof TextData] as string },
					},
					annotations: text.annotationUi,
				});
			}
		} else if (text.textType === 'equation') {
			results.push({
				type: 'equation',
				equation: {
					expression: text.expression,
				},
				annotations: text.annotationUi,
			});
		}
	}
	return results;
}

function getTextBlocks(block: IDataObject) {
	return {
		text:
			block.richText === false
				? formatText(block.textContent as string).text
				: getTexts(((block.text as IDataObject).text as TextData[]) || []),
	};
}

export function formatBlocks(blocks: IDataObject[]) {
	const results = [];
	for (const block of blocks) {
		results.push({
			object: 'block',
			type: block.type,
			[block.type as string]: {
				...(block.type === 'to_do' ? { checked: block.checked } : {}),
				...(block.type === 'image' ? { type: 'external', external: { url: block.url } } : {}),
				...(!['image'].includes(block.type as string) ? getTextBlocks(block) : {}),
			},
		});
	}
	return results;
}

function getDateFormat(includeTime: boolean) {
	if (!includeTime) {
		return 'yyyy-MM-DD';
	}
	return '';
}

function isEmpty(value: unknown): boolean {
	return value === undefined || value === null || value === '';
}

function getPropertyKeyValue(
	this: IExecuteFunctions,
	value: any,
	type: string,
	timezone: string,
	version = 1,
) {
	const ignoreIfEmpty = <T>(v: T, cb: (v: T) => any) =>
		!v && value.ignoreIfEmpty ? undefined : cb(v);
	let result: IDataObject = {};

	switch (type) {
		case 'rich_text':
			if (value.richText === false) {
				result = { rich_text: [{ text: { content: value.textContent } }] };
			} else {
				result = { rich_text: getTexts(value.text.text as TextData[]) };
			}
			break;
		case 'title':
			result = { title: [{ text: { content: value.title } }] };
			break;
		case 'number':
			result = { type: 'number', number: value.numberValue };
			break;
		case 'url':
			result = ignoreIfEmpty(value.urlValue, (url) => ({ type: 'url', url }));
			break;
		case 'checkbox':
			result = { type: 'checkbox', checkbox: value.checkboxValue };
			break;
		case 'relation':
			result = {
				type: 'relation',
				relation: value.relationValue
					.filter((relation: IDataObject) => {
						return relation && typeof relation === 'string';
					})
					.reduce((acc: string[], cur: string) => {
						return acc.concat(cur.split(',').map((relation: string) => relation.trim()));
					}, [])
					.filter((relation: string) => {
						return uuidValidateWithoutDashes.call(this, relation);
					})
					.map((relation: string) => ({ id: relation })),
			};
			break;
		case 'multi_select':
			if (isEmpty(value.multiSelectValue)) {
				result = {
					type: 'multi_select',
					multi_select: [],
				};
				break;
			}

			const multiSelectValue = value.multiSelectValue;

			result = {
				type: 'multi_select',
				multi_select: (Array.isArray(multiSelectValue)
					? multiSelectValue
					: multiSelectValue.split(',').map((v: string) => v.trim())
				)
					.filter((entry: any) => entry !== null)
					.map((option: string) => (!uuidValidate(option) ? { name: option } : { id: option })),
			};
			break;
		case 'email':
			result = {
				type: 'email',
				email: value.emailValue,
			};
			break;
		case 'people':
			//if expression it's a single value, make it an array
			if (!Array.isArray(value.peopleValue)) {
				value.peopleValue = [value.peopleValue];
			}

			result = {
				type: 'people',
				people: value.peopleValue.map((option: string) => ({ id: option })),
			};
			break;
		case 'phone_number':
			result = {
				type: 'phone_number',
				phone_number: value.phoneValue,
			};
			break;
		case 'select':
			if (isEmpty(value.selectValue)) {
				result = {
					type: 'select',
					select: null,
				};
				break;
			}

			result = {
				type: 'select',
				select: version === 1 ? { id: value.selectValue } : { name: value.selectValue },
			};
			break;
		case 'status':
			result = {
				type: 'status',
				status: { name: value.statusValue },
			};
			break;
		case 'date':
			const format = getDateFormat(value.includeTime as boolean);
			const timezoneValue = value.timezone === 'default' ? timezone : value.timezone;
			if (value.range === true) {
				result = {
					type: 'date',
					date: {
						start: moment.tz(value.dateStart as number, timezoneValue as string).format(format),
						end: moment.tz(value.dateEnd as number, timezoneValue as string).format(format),
					},
				};
			} else {
				result = {
					type: 'date',
					date: {
						start: moment.tz(value.date as number, timezoneValue as string).format(format),
						end: null,
					},
				};
			}

			//if the date was left empty, set it to null so it resets the value in notion
			if (value.date === '' || (value.dateStart === '' && value.dateEnd === '')) {
				result.date = null;
			}

			break;
		case 'files':
			result = {
				type: 'files',
				files: value.fileUrls.fileUrl.map((file: { name: string; url: string }) => ({
					name: file.name,
					type: 'external',
					external: { url: file.url },
				})),
			};
			break;
		default:
	}
	return result;
}

function getNameAndType(key: string) {
	const [name, type] = key.split('|');
	return {
		name,
		type,
	};
}

export function mapProperties(
	this: IExecuteFunctions,
	properties: IDataObject[],
	timezone: string,
	version = 1,
) {
	return properties
		.filter(
			(property): property is Record<string, { key: string; [k: string]: any }> =>
				typeof property.key === 'string',
		)
		.map(
			(property) =>
				[
					`${property.key.split('|')[0]}`,
					getPropertyKeyValue.call(
						this,
						property,
						property.key.split('|')[1] as string,
						timezone,
						version,
					),
				] as const,
		)
		.filter(([, value]) => value)
		.reduce(
			(obj, [key, value]) =>
				Object.assign(obj, {
					[key]: value,
				}),
			{},
		);
}

export function mapSorting(data: SortData[]) {
	return data.map((sort) => {
		return {
			direction: sort.direction,
			[sort.timestamp ? 'timestamp' : 'property']: sort.key.split('|')[0],
		};
	});
}

export function mapFilters(filtersList: IDataObject[], timezone: string) {
	return filtersList.reduce((obj, value: { [key: string]: any }) => {
		let key = getNameAndType(value.key as string).type;

		let valuePropertyName =
			key === 'last_edited_time' ? value[camelCase(key)] : value[`${camelCase(key)}Value`];

		if (['is_empty', 'is_not_empty'].includes(value.condition as string)) {
			valuePropertyName = true;
		} else if (
			['past_week', 'past_month', 'past_year', 'next_week', 'next_month', 'next_year'].includes(
				value.condition as string,
			)
		) {
			valuePropertyName = {};
		}
		if (key === 'rich_text' || key === 'text') {
			key = 'text';
		} else if (key === 'phone_number') {
			key = 'phone';
		} else if (
			key === 'date' &&
			!['is_empty', 'is_not_empty'].includes(value.condition as string)
		) {
			valuePropertyName = value.date === '' ? {} : moment.tz(value.date, timezone).utc().format();
		} else if (key === 'boolean') {
			key = 'checkbox';
		}

		if (value.type === 'formula') {
			if (['is_empty', 'is_not_empty'].includes(value.condition as string)) {
				key = value.returnType;
			} else {
				const vpropertyName = value[`${camelCase(value.returnType as string)}Value`];

				return Object.assign(obj, {
					['property']: getNameAndType(value.key as string).name,
					[key]: { [value.returnType]: { [`${value.condition}`]: vpropertyName } },
				});
			}
		}

		return Object.assign(obj, {
			['property']: getNameAndType(value.key as string)?.name,
			[key]: { [`${value.condition}`]: valuePropertyName },
		});
	}, {});
}

function simplifyProperty(property: any) {
	let result: any;
	const type = (property as IDataObject).type as string;
	if (['text'].includes(property.type as string)) {
		result = property.plain_text;
	} else if (['rich_text', 'title'].includes(property.type as string)) {
		if (Array.isArray(property[type]) && property[type].length !== 0) {
			result = property[type].map((text: any) => simplifyProperty(text) as string).join('');
		} else {
			result = '';
		}
	} else if (
		[
			'url',
			'created_time',
			'checkbox',
			'number',
			'last_edited_time',
			'email',
			'phone_number',
			'date',
		].includes(property.type as string)
	) {
		result = property[type];
	} else if (['created_by', 'last_edited_by', 'select'].includes(property.type as string)) {
		result = property[type] ? property[type]?.name : null;
	} else if (['people'].includes(property.type as string)) {
		if (Array.isArray(property[type])) {
			result = property[type].map((person: any) => person.person?.email || {});
		} else {
			result = property[type];
		}
	} else if (['multi_select'].includes(property.type as string)) {
		if (Array.isArray(property[type])) {
			result = property[type].map((e: IDataObject) => e?.name || {});
		} else {
			result = property[type].options.map((e: IDataObject) => e?.name || {});
		}
	} else if (['relation'].includes(property.type as string)) {
		if (Array.isArray(property[type])) {
			result = property[type].map((e: IDataObject) => e?.id || {});
		} else {
			result = property[type]?.database_id;
		}
	} else if (['formula'].includes(property.type as string)) {
		result = property[type]?.[property[type]?.type];
	} else if (['rollup'].includes(property.type as string)) {
		const rollupFunction = property[type]?.function as string;
		if (rollupFunction.startsWith('count') || rollupFunction.includes('empty')) {
			result = property[type]?.number;
			if (rollupFunction.includes('percent')) {
				result = result * 100;
			}
		} else if (rollupFunction.startsWith('show') && property[type]?.type === 'array') {
			const elements = property[type].array.map(simplifyProperty).flat();
			result = rollupFunction === 'show_unique' ? [...new Set(elements as string)] : elements;
		}
	} else if (['files'].includes(property.type as string)) {
		result = property[type].map(
			(file: { type: string; [key: string]: any }) => file[file.type]?.url,
		);
	} else if (['status'].includes(property.type as string)) {
		result = property[type]?.name;
	}
	return result;
}

export function simplifyProperties(properties: any) {
	const results: any = {};
	for (const key of Object.keys(properties as IDataObject)) {
		results[`${key}`] = simplifyProperty(properties[key]);
	}
	return results;
}

export function getPropertyTitle(properties: { [key: string]: any }) {
	return (
		Object.values(properties).filter((property) => property.type === 'title')[0].title[0]
			?.plain_text || ''
	);
}

function prepend(stringKey: string, properties: { [key: string]: any }) {
	for (const key of Object.keys(properties)) {
		properties[`${stringKey}_${snakeCase(key)}`] = properties[key];
		delete properties[key];
	}
	return properties;
}

export function simplifyObjects(objects: any, download = false, version = 2) {
	if (!Array.isArray(objects)) {
		objects = [objects];
	}
	const results: IDataObject[] = [];
	for (const { object, id, properties, parent, title, json, binary, url } of objects) {
		if (object === 'page' && (parent.type === 'page_id' || parent.type === 'workspace')) {
			results.push({
				id,
				name: properties.title.title[0].plain_text,
				...(version === 2 ? { url } : {}),
			});
		} else if (object === 'page' && parent.type === 'database_id') {
			results.push({
				id,
				...(version === 2 ? { name: getPropertyTitle(properties as IDataObject) } : {}),
				...(version === 2 ? { url } : {}),
				...(version === 2
					? { ...prepend('property', simplifyProperties(properties) as IDataObject) }
					: { ...simplifyProperties(properties) }),
			} as IDataObject);
		} else if (download && json.object === 'page' && json.parent.type === 'database_id') {
			results.push({
				json: {
					id: json.id,
					...(version === 2 ? { name: getPropertyTitle(json.properties as IDataObject) } : {}),
					...(version === 2 ? { url: json.url } : {}),
					...(version === 2
						? { ...prepend('property', simplifyProperties(json.properties) as IDataObject) }
						: { ...simplifyProperties(json.properties) }),
				},
				binary,
			});
		} else if (object === 'database') {
			results.push({
				id,
				...(version === 2
					? { name: title[0]?.plain_text || '' }
					: { title: title[0]?.plain_text || '' }),
				...(version === 2 ? { url } : {}),
			});
		}
	}
	return results;
}

export function getFormattedChildren(children: IDataObject[]) {
	const results: IDataObject[] = [];
	for (const child of children) {
		const type = child.type;
		results.push({ [`${type}`]: child, object: 'block', type });
	}
	return results;
}

export function getConditions() {
	const elements: INodeProperties[] = [];

	const types: { [key: string]: string } = {
		title: 'rich_text',
		rich_text: 'rich_text',
		number: 'number',
		checkbox: 'checkbox',
		select: 'select',
		multi_select: 'multi_select',
		status: 'status',
		date: 'date',
		people: 'people',
		files: 'files',
		url: 'rich_text',
		email: 'rich_text',
		phone_number: 'rich_text',
		relation: 'relation',
		//formula: 'formula',
		created_by: 'people',
		created_time: 'date',
		last_edited_by: 'people',
		last_edited_time: 'date',
	};

	const typeConditions: { [key: string]: string[] } = {
		rich_text: [
			'equals',
			'does_not_equal',
			'contains',
			'does_not_contain',
			'starts_with',
			'ends_with',
			'is_empty',
			'is_not_empty',
		],
		number: [
			'equals',
			'does_not_equal',
			'greater_than',
			'less_than',
			'greater_than_or_equal_to',
			'less_than_or_equal_to',
			'is_empty',
			'is_not_empty',
		],
		checkbox: ['equals', 'does_not_equal'],
		select: ['equals', 'does_not_equal', 'is_empty', 'is_not_empty'],
		multi_select: ['contains', 'does_not_equal', 'is_empty', 'is_not_empty'],
		status: ['equals', 'does_not_equal'],
		date: [
			'equals',
			'before',
			'after',
			'on_or_before',
			'is_empty',
			'is_not_empty',
			'on_or_after',
			'past_week',
			'past_month',
			'past_year',
			'next_week',
			'next_month',
			'next_year',
		],
		people: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
		files: ['is_empty', 'is_not_empty'],
		relation: ['contains', 'does_not_contain', 'is_empty', 'is_not_empty'],
	};

	const formula: { [key: string]: string[] } = {
		text: [...typeConditions.rich_text],
		checkbox: [...typeConditions.checkbox],
		number: [...typeConditions.number],
		date: [...typeConditions.date],
	};

	for (const type of Object.keys(types)) {
		elements.push({
			displayName: 'Condition',
			name: 'condition',
			type: 'options',
			displayOptions: {
				show: {
					type: [type],
				},
			} as IDisplayOptions,
			options: typeConditions[types[type]].map((entry: string) => ({
				name: capitalCase(entry),
				value: entry,
			})),
			default: '',
			description: 'The value of the property to filter by',
		} as INodeProperties);
	}

	elements.push({
		displayName: 'Return Type',
		name: 'returnType',
		type: 'options',
		displayOptions: {
			show: {
				type: ['formula'],
			},
		} as IDisplayOptions,
		options: Object.keys(formula).map((key: string) => ({ name: capitalCase(key), value: key })),
		default: '',
		description: 'The formula return type',
	} as INodeProperties);

	for (const key of Object.keys(formula)) {
		elements.push({
			displayName: 'Condition',
			name: 'condition',
			type: 'options',
			displayOptions: {
				show: {
					type: ['formula'],
					returnType: [key],
				},
			} as IDisplayOptions,
			options: formula[key].map((entry: string) => ({ name: capitalCase(entry), value: entry })),
			default: '',
			description: 'The value of the property to filter by',
		} as INodeProperties);
	}

	return elements;
}

export type FileRecord = {
	properties: {
		[key: string]:
			| any
			| {
					id: string;
					type: string;
					files: [{ external: { url: string } } | { file: { url: string } }];
			  };
	};
};

export async function downloadFiles(
	this: IExecuteFunctions | IPollFunctions,
	records: FileRecord[],
	pairedItem?: IPairedItemData[],
): Promise<INodeExecutionData[]> {
	const elements: INodeExecutionData[] = [];
	for (const record of records) {
		const element: INodeExecutionData = { json: {}, binary: {} };
		element.json = record as unknown as IDataObject;
		if (pairedItem) {
			element.pairedItems = pairedItem;
		}
		for (const key of Object.keys(record.properties)) {
			if (record.properties[key].type === 'files') {
				if (record.properties[key].files.length) {
					for (const [index, file] of record.properties[key].files.entries()) {
						const data = await notionApiRequest.call(
							this,
							'GET',
							'',
							{},
							{},
							(file?.file?.url as string) || (file?.external?.url as string),
							{ json: false, encoding: null },
						);
						element.binary![`${key}_${index}`] = await this.helpers.prepareBinaryData(
							data as Buffer,
						);
					}
				}
			}
		}
		if (Object.keys(element.binary as IBinaryKeyData).length === 0) {
			delete element.binary;
		}
		elements.push(element);
	}
	return elements;
}

export function extractPageId(page = '') {
	if (page.includes('p=')) {
		return page.split('p=')[1];
	} else if (page.includes('-') && page.includes('https')) {
		return page.split('-')[page.split('-').length - 1];
	}
	return page;
}

export function getPageId(this: IExecuteFunctions, i: number) {
	const page = this.getNodeParameter('pageId', i, {}) as INodeParameterResourceLocator;
	let pageId = '';

	if (page.value && typeof page.value === 'string') {
		if (page.mode === 'id') {
			pageId = page.value;
		} else if (page.value.includes('p=')) {
			// e.g https://www.notion.so/xxxxx?v=xxxxx&p=xxxxx&pm=s
			pageId = new URLSearchParams(page.value).get('p') || '';
		} else {
			// e.g https://www.notion.so/page_name-xxxxx
			pageId = page.value.match(databasePageUrlValidationRegexp)?.[1] || '';
		}
	}

	if (!pageId) {
		throw new NodeOperationError(
			this.getNode(),
			'Could not extract page ID from URL: ' + page.value,
		);
	}

	return pageId;
}

export function extractDatabaseId(database: string) {
	if (database.includes('?v=')) {
		const data = database.split('?v=')[0].split('/');
		const index = data.length - 1;
		return data[index];
	} else if (database.includes('/')) {
		const index = database.split('/').length - 1;
		return database.split('/')[index];
	} else {
		return database;
	}
}

export function getSearchFilters(resource: string) {
	return [
		{
			displayName: 'Filter',
			name: 'filterType',
			type: 'options',
			options: [
				{
					name: 'None',
					value: 'none',
				},
				{
					name: 'Build Manually',
					value: 'manual',
				},
				{
					name: 'JSON',
					value: 'json',
				},
			],
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
				},
				hide: {
					'@version': [1],
				},
			},
			default: 'none',
		},
		{
			displayName: 'Must Match',
			name: 'matchType',
			type: 'options',
			options: [
				{
					name: 'Any filter',
					value: 'anyFilter',
				},
				{
					name: 'All Filters',
					value: 'allFilters',
				},
			],
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
					filterType: ['manual'],
				},
				hide: {
					'@version': [1],
				},
			},
			default: 'anyFilter',
		},
		{
			displayName: 'Filters',
			name: 'filters',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
					filterType: ['manual'],
				},
				hide: {
					'@version': [1],
				},
			},
			default: {},
			placeholder: 'Add Condition',
			options: [
				{
					displayName: 'Conditions',
					name: 'conditions',
					values: [...filters(getConditions())],
				},
			],
		},
		{
			displayName:
				'See <a href="https://developers.notion.com/reference/post-database-query#post-database-query-filter" target="_blank">Notion guide</a> to creating filters',
			name: 'jsonNotice',
			type: 'notice',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
					filterType: ['json'],
				},
				hide: {
					'@version': [1],
				},
			},
			default: '',
		},
		{
			displayName: 'Filters (JSON)',
			name: 'filterJson',
			type: 'string',
			displayOptions: {
				show: {
					resource: [resource],
					operation: ['getAll'],
					filterType: ['json'],
				},
				hide: {
					'@version': [1],
				},
			},
			default: '',
		},
	];
}

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}

/**
 * Manually extract a richtext's database mention RLC parameter.
 * @param blockValues the blockUi.blockValues node parameter.
 */
export function extractDatabaseMentionRLC(blockValues: IDataObject[]) {
	blockValues.forEach((bv) => {
		if (bv.richText && bv.text) {
			const texts = (
				bv.text as {
					text: [
						{
							textType: string;
							mentionType: string;
							database: string | { value: string; mode: string; __rl: boolean; __regex: string };
						},
					];
				}
			).text;
			texts.forEach((txt) => {
				if (txt.textType === 'mention' && txt.mentionType === 'database') {
					if (typeof txt.database === 'object' && txt.database.__rl) {
						if (txt.database.__regex) {
							const regex = new RegExp(txt.database.__regex);
							const extracted = regex.exec(txt.database.value);
							txt.database = extracted![1];
						} else {
							txt.database = txt.database.value;
						}
					}
				}
			});
		}
	});
}

export function simplifyBlocksOutput(blocks: IDataObject[], rootId: string) {
	for (const block of blocks) {
		const type = block.type as string;
		block.root_id = rootId;

		['created_time', 'last_edited_time', 'created_by'].forEach((key) => {
			delete block[key];
		});

		try {
			if (['code'].includes(type)) {
				const text = (block[type] as IDataObject).text as IDataObject[];
				if (text && Array.isArray(text)) {
					const content = text.map((entry) => entry.plain_text || '').join('');
					block.content = content;
					delete block[type];
				}
				continue;
			}

			if (['child_page', 'child_database'].includes(type)) {
				const content = (block[type] as IDataObject).title as string;
				block.content = content;
				delete block[type];
				continue;
			}

			const text = (block[type] as IDataObject)?.text as IDataObject[];

			if (text && Array.isArray(text)) {
				const content = text.map((entry) => entry.plain_text || '').join('');
				block.content = content;
				delete block[type];
			}
		} catch (e) {
			continue;
		}
	}

	return blocks;
}

export function extractBlockId(this: IExecuteFunctions, nodeVersion: number, itemIndex: number) {
	let blockId: string;

	if (nodeVersion < 2.2) {
		blockId = extractPageId(
			this.getNodeParameter('blockId', itemIndex, '', { extractValue: true }) as string,
		);
	} else {
		const blockIdRLCData = this.getNodeParameter('blockId', itemIndex, {}) as IDataObject;

		if (blockIdRLCData.mode === 'id') {
			blockId = blockIdRLCData.value as string;
		} else {
			const blockRegex = /https:\/\/www\.notion\.so\/.+\?pvs=[0-9]+#([a-f0-9]{2,})/;
			const match = (blockIdRLCData.value as string).match(blockRegex);

			if (match === null) {
				const pageRegex = new RegExp(blockUrlExtractionRegexp);
				const pageMatch = (blockIdRLCData.value as string).match(pageRegex);

				if (pageMatch === null) {
					throw new NodeOperationError(
						this.getNode(),
						'Invalid URL, could not find block ID or page ID',
						{
							itemIndex,
						},
					);
				} else {
					blockId = extractPageId(pageMatch[1]);
				}
			} else {
				blockId = match[1];
			}
		}
	}

	return blockId;
}

export const prepareNotionError = (node: INode, error: Error, itemIndex: number) => {
	if (error instanceof NodeApiError) {
		set(error, 'context.itemIndex', itemIndex);
		return error;
	}

	if (error instanceof NodeOperationError && error?.context?.itemIndex === undefined) {
		set(error, 'context.itemIndex', itemIndex);
		return error;
	}

	return new NodeOperationError(node, error, { itemIndex });
};
