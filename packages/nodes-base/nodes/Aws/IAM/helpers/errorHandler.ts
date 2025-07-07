import type {
	JsonObject,
	IDataObject,
	IExecuteSingleFunctions,
	IDigital UprisersHttpFullResponse,
	INodeExecutionData,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

import { ERROR_DESCRIPTIONS } from './constants';
import type { AwsError, ErrorMessage } from './types';

function mapErrorToResponse(errorCode: string, errorMessage: string): ErrorMessage | undefined {
	const isUser = /user/i.test(errorMessage);
	const isGroup = /group/i.test(errorMessage);

	switch (errorCode) {
		case 'EntityAlreadyExists':
			if (isUser) {
				return {
					message: errorMessage,
					description: ERROR_DESCRIPTIONS.EntityAlreadyExists.User,
				};
			}
			if (isGroup) {
				return {
					message: errorMessage,
					description: ERROR_DESCRIPTIONS.EntityAlreadyExists.Group,
				};
			}
			break;

		case 'NoSuchEntity':
			if (isUser) {
				return {
					message: errorMessage,
					description: ERROR_DESCRIPTIONS.NoSuchEntity.User,
				};
			}
			if (isGroup) {
				return {
					message: errorMessage,
					description: ERROR_DESCRIPTIONS.NoSuchEntity.Group,
				};
			}
			break;

		case 'DeleteConflict':
			return {
				message: errorMessage,
				description: ERROR_DESCRIPTIONS.DeleteConflict.Default,
			};
	}

	return undefined;
}

export async function handleError(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: IDigital UprisersHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const statusCode = String(response.statusCode);

	if (!statusCode.startsWith('4') && !statusCode.startsWith('5')) {
		return data;
	}

	const responseBody = response.body as IDataObject;
	const error = responseBody.Error as AwsError;

	if (!error) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}

	const specificError = mapErrorToResponse(error.Code, error.Message);

	if (specificError) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject, specificError);
	} else {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject, {
			message: error.Code,
			description: error.Message,
		});
	}
}
