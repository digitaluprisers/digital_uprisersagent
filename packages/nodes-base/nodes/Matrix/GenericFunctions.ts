import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { NodeApiError, NodeOperationError } from 'Digital Uprisers-workflow';
import { v4 as uuid } from 'uuid';

export async function matrixApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: string | object = {},
	query: IDataObject = {},
	headers: IDataObject | undefined = undefined,
	option: IDataObject = {},
) {
	let options: IRequestOptions = {
		method,
		headers: headers || {
			'Content-Type': 'application/json; charset=utf-8',
		},
		body,
		qs: query,
		uri: '',
		json: true,
	};
	options = Object.assign({}, options, option);
	if (Object.keys(body).length === 0) {
		delete options.body;
	}
	if (Object.keys(query).length === 0) {
		delete options.qs;
	}
	try {
		const credentials = await this.getCredentials('matrixApi');

		options.uri = `${credentials.homeserverUrl}/_matrix/${
			option.overridePrefix || 'client'
		}/r0${resource}`;
		options.headers!.Authorization = `Bearer ${credentials.accessToken}`;
		const response = await this.helpers.request(options);

		// When working with images, the request cannot be JSON (it's raw binary data)
		// But the output is JSON so we have to parse it manually.
		//@ts-ignore
		return options.overridePrefix === 'media' ? JSON.parse(response as string) : response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function handleMatrixCall(
	this: IExecuteFunctions,
	index: number,
	resource: string,
	operation: string,
): Promise<any> {
	if (resource === 'account') {
		if (operation === 'me') {
			return await matrixApiRequest.call(this, 'GET', '/account/whoami');
		}
	} else if (resource === 'room') {
		if (operation === 'create') {
			const name = this.getNodeParameter('roomName', index) as string;
			const preset = this.getNodeParameter('preset', index) as string;
			const roomAlias = this.getNodeParameter('roomAlias', index) as string;
			const body: IDataObject = {
				name,
				preset,
			};
			if (roomAlias) {
				body.room_alias_name = roomAlias;
			}
			return await matrixApiRequest.call(this, 'POST', '/createRoom', body);
		} else if (operation === 'join') {
			const roomIdOrAlias = this.getNodeParameter('roomIdOrAlias', index) as string;
			return await matrixApiRequest.call(this, 'POST', `/rooms/${roomIdOrAlias}/join`);
		} else if (operation === 'leave') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			return await matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/leave`);
		} else if (operation === 'invite') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const userId = this.getNodeParameter('userId', index) as string;
			const body: IDataObject = {
				user_id: userId,
			};
			return await matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/invite`, body);
		} else if (operation === 'kick') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const userId = this.getNodeParameter('userId', index) as string;
			const reason = this.getNodeParameter('reason', index) as string;
			const body: IDataObject = {
				user_id: userId,
				reason,
			};
			return await matrixApiRequest.call(this, 'POST', `/rooms/${roomId}/kick`, body);
		}
	} else if (resource === 'message') {
		if (operation === 'create') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const text = this.getNodeParameter('text', index, '') as string;
			const messageType = this.getNodeParameter('messageType', index) as string;
			const messageFormat = this.getNodeParameter('messageFormat', index) as string;
			const body: IDataObject = {
				msgtype: messageType,
				body: text,
			};
			if (messageFormat === 'org.matrix.custom.html') {
				const fallbackText = this.getNodeParameter('fallbackText', index, '') as string;
				body.format = messageFormat;
				body.formatted_body = text;
				body.body = fallbackText;
			}
			const messageId = uuid();
			return await matrixApiRequest.call(
				this,
				'PUT',
				`/rooms/${roomId}/send/m.room.message/${messageId}`,
				body,
			);
		} else if (operation === 'getAll') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index);
			const otherOptions = this.getNodeParameter('otherOptions', index) as IDataObject;
			const returnData: IDataObject[] = [];

			if (returnAll) {
				let responseData;
				let from;
				do {
					const qs: IDataObject = {
						dir: 'b', // Get latest messages first - doesn't return anything if we use f without a previous token.
						from,
					};

					if (otherOptions.filter) {
						qs.filter = otherOptions.filter;
					}

					responseData = await matrixApiRequest.call(
						this,
						'GET',
						`/rooms/${roomId}/messages`,
						{},
						qs,
					);
					returnData.push.apply(returnData, responseData.chunk as IDataObject[]);
					from = responseData.end;
				} while (responseData.chunk.length > 0);
			} else {
				const limit = this.getNodeParameter('limit', index);
				const qs: IDataObject = {
					dir: 'b', // GetfallbackText latest messages first - doesn't return anything if we use f without a previous token.
					limit,
				};

				if (otherOptions.filter) {
					qs.filter = otherOptions.filter;
				}

				const responseData = await matrixApiRequest.call(
					this,
					'GET',
					`/rooms/${roomId}/messages`,
					{},
					qs,
				);
				returnData.push.apply(returnData, responseData.chunk as IDataObject[]);
			}

			return returnData;
		}
	} else if (resource === 'event') {
		if (operation === 'get') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const eventId = this.getNodeParameter('eventId', index) as string;
			return await matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/event/${eventId}`);
		}
	} else if (resource === 'media') {
		if (operation === 'upload') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const mediaType = this.getNodeParameter('mediaType', index) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index);
			const additionalFields = this.getNodeParameter('additionalFields', index);

			let body;
			const qs: IDataObject = {};
			const headers: IDataObject = {};

			const { fileName, mimeType } = this.helpers.assertBinaryData(index, binaryPropertyName);
			body = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

			if (additionalFields.fileName) {
				qs.filename = additionalFields.fileName as string;
			} else {
				qs.filename = fileName;
			}

			headers['Content-Type'] = mimeType;
			headers.accept = 'application/json,text/*;q=0.99';

			const uploadRequestResult = await matrixApiRequest.call(
				this,
				'POST',
				'/upload',
				body,
				qs,
				headers,
				{
					overridePrefix: 'media',
					json: false,
				},
			);

			body = {
				msgtype: `m.${mediaType}`,
				body: qs.filename,
				url: uploadRequestResult.content_uri,
			};
			const messageId = uuid();
			return await matrixApiRequest.call(
				this,
				'PUT',
				`/rooms/${roomId}/send/m.room.message/${messageId}`,
				body,
			);
		}
	} else if (resource === 'roomMember') {
		if (operation === 'getAll') {
			const roomId = this.getNodeParameter('roomId', index) as string;
			const filters = this.getNodeParameter('filters', index);
			const qs: IDataObject = {
				membership: filters.membership ? filters.membership : '',
				not_membership: filters.notMembership ? filters.notMembership : '',
			};
			const roomMembersResponse = await matrixApiRequest.call(
				this,
				'GET',
				`/rooms/${roomId}/members`,
				{},
				qs,
			);
			return roomMembersResponse.chunk;
		}
	}

	throw new NodeOperationError(this.getNode(), 'Not implemented yet');
}
