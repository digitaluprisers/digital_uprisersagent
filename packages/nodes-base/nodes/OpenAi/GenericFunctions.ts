import type {
	IExecuteSingleFunctions,
	IDigital UprisersHttpFullResponse,
	INodeExecutionData,
	JsonObject,
} from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

export async function sendErrorPostReceive(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: IDigital UprisersHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}
	return data;
}
