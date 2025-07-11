import * as losslessJSON from 'lossless-json';
import moment from 'moment-timezone';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IRequestOptions,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

function convertLosslessNumber(_: any, value: any) {
	if (value?.isLosslessNumber) {
		return value.toString();
	} else {
		return value;
	}
}

/**
 * Make an authenticated API request to GoToWebinar.
 */
export async function goToWebinarApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject,
	body: IDataObject | IDataObject[],
	option: IDataObject = {},
) {
	const operation = this.getNodeParameter('operation', 0);
	const resource = this.getNodeParameter('resource', 0);

	const options: IRequestOptions = {
		headers: {
			'user-agent': 'Digital Uprisers',
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		uri: `https://api.getgo.com/G2W/rest/v2/${endpoint}`,
		qs,
		body: JSON.stringify(body),
		json: false,
	};

	if (resource === 'session' && operation === 'getAll') {
		options.headers!.Accept = 'application/vnd.citrix.g2wapi-v1.1+json';
	}

	if (['GET', 'DELETE'].includes(method)) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	if (Object.keys(option)) {
		Object.assign(options, option);
	}

	try {
		const response = await this.helpers.requestOAuth2.call(this, 'goToWebinarOAuth2Api', options, {
			tokenExpiredStatusCode: 403,
		});

		if (response === '') {
			return {};
		}

		// https://stackoverflow.com/questions/62190724/getting-gotowebinar-registrant
		return losslessJSON.parse(response as string, convertLosslessNumber);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated API request to GoToWebinar and return all results.
 */
export async function goToWebinarApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	query: IDataObject,
	body: IDataObject,
	resource: string,
) {
	const resourceToResponseKey: { [key: string]: string } = {
		session: 'sessionInfoResources',
		webinar: 'webinars',
	};

	const key = resourceToResponseKey[resource];

	let returnData: IDataObject[] = [];
	let responseData;

	do {
		responseData = await goToWebinarApiRequest.call(this, method, endpoint, query, body);

		if (responseData.page && parseInt(responseData.page.totalElements as string, 10) === 0) {
			return [];
		} else if (responseData._embedded?.[key]) {
			returnData.push(...(responseData._embedded[key] as IDataObject[]));
		} else {
			returnData.push(...(responseData as IDataObject[]));
		}

		const limit = query.limit as number | undefined;
		if (limit && returnData.length >= limit) {
			returnData = returnData.splice(0, limit);
			return returnData;
		}
	} while (
		responseData.totalElements &&
		parseInt(responseData.totalElements as string, 10) > returnData.length
	);

	return returnData;
}

export async function handleGetAll(
	this: IExecuteFunctions,
	endpoint: string,
	qs: IDataObject,
	body: IDataObject,
	resource: string,
) {
	const returnAll = this.getNodeParameter('returnAll', 0);

	if (!returnAll) {
		qs.limit = this.getNodeParameter('limit', 0);
	}

	return await goToWebinarApiRequestAllItems.call(this, 'GET', endpoint, qs, body, resource);
}

export async function loadWebinars(this: ILoadOptionsFunctions) {
	const { oauthTokenData } = await this.getCredentials<{
		oauthTokenData: { account_key: string };
	}>('goToWebinarOAuth2Api');

	const endpoint = `accounts/${oauthTokenData.account_key}/webinars`;

	const qs = {
		fromTime: moment().subtract(1, 'years').format(),
		toTime: moment().add(1, 'years').format(),
	};

	const resourceItems = await goToWebinarApiRequestAllItems.call(
		this,
		'GET',
		endpoint,
		qs,
		{},
		'webinar',
	);

	const returnData: INodePropertyOptions[] = [];

	resourceItems.forEach((item) => {
		returnData.push({
			name: item.subject as string,
			value: item.webinarKey as string,
		});
	});

	return returnData;
}

export async function loadWebinarSessions(this: ILoadOptionsFunctions) {
	const { oauthTokenData } = await this.getCredentials<{
		oauthTokenData: { organizer_key: string };
	}>('goToWebinarOAuth2Api');

	const webinarKey = this.getCurrentNodeParameter('webinarKey') as string;

	const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/sessions`;

	const resourceItems = await goToWebinarApiRequestAllItems.call(
		this,
		'GET',
		endpoint,
		{},
		{},
		'session',
	);

	const returnData: INodePropertyOptions[] = [];

	resourceItems.forEach((item) => {
		returnData.push({
			name: `Date: ${moment(item.startTime as string).format('MM-DD-YYYY')} | From: ${moment(
				item.startTime as string,
			).format('LT')} - To: ${moment(item.endTime as string).format('LT')}`,
			value: item.sessionKey as string,
		});
	});

	return returnData;
}

export async function loadRegistranSimpleQuestions(this: ILoadOptionsFunctions) {
	const { oauthTokenData } = await this.getCredentials<{
		oauthTokenData: { organizer_key: string };
	}>('goToWebinarOAuth2Api');

	const webinarkey = this.getNodeParameter('webinarKey') as string;

	const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;

	const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});

	const returnData: INodePropertyOptions[] = [];

	questions.forEach((item: IDataObject) => {
		if (item.type === 'shortAnswer') {
			returnData.push({
				name: item.question as string,
				value: item.questionKey as string,
			});
		}
	});

	return returnData;
}

export async function loadAnswers(this: ILoadOptionsFunctions) {
	const { oauthTokenData } = await this.getCredentials<{
		oauthTokenData: { organizer_key: string };
	}>('goToWebinarOAuth2Api');

	const webinarKey = this.getCurrentNodeParameter('webinarKey') as string;

	const questionKey = this.getCurrentNodeParameter('questionKey') as string;

	const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarKey}/registrants/fields`;

	const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});

	const returnData: INodePropertyOptions[] = [];

	questions.forEach((item: IDataObject) => {
		if (item.type === 'multiChoice' && item.questionKey === questionKey) {
			for (const answer of item.answers as IDataObject[]) {
				returnData.push({
					name: answer.answer as string,
					value: answer.answerKey as string,
				});
			}
		}
	});

	return returnData;
}

export async function loadRegistranMultiChoiceQuestions(this: ILoadOptionsFunctions) {
	const { oauthTokenData } = await this.getCredentials<{
		oauthTokenData: { organizer_key: string };
	}>('goToWebinarOAuth2Api');

	const webinarkey = this.getNodeParameter('webinarKey') as string;

	const endpoint = `organizers/${oauthTokenData.organizer_key}/webinars/${webinarkey}/registrants/fields`;

	const { questions } = await goToWebinarApiRequest.call(this, 'GET', endpoint, {}, {});

	const returnData: INodePropertyOptions[] = [];

	questions.forEach((item: IDataObject) => {
		if (item.type === 'multipleChoice') {
			returnData.push({
				name: item.question as string,
				value: item.questionKey as string,
			});
		}
	});

	return returnData;
}
