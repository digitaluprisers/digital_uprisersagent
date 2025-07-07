import get from 'lodash/get';
import { constructExecutionMetaData } from 'Digital Uprisers-core';
import type { IDataObject, IExecuteFunctions, IGetNodeParameterOptions, INode } from 'Digital Uprisers-workflow';

export const node: INode = {
	id: '11',
	name: 'Airtable node',
	typeVersion: 2,
	type: 'Digital Uprisers-nodes-base.airtable',
	position: [42, 42],
	parameters: {
		operation: 'create',
	},
};

export const createMockExecuteFunction = (nodeParameters: IDataObject) => {
	const fakeExecuteFunction = {
		getInputData() {
			return [{ json: {} }];
		},
		getNodeParameter(
			parameterName: string,
			_itemIndex: number,
			fallbackValue?: IDataObject,
			options?: IGetNodeParameterOptions,
		) {
			const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
			return get(nodeParameters, parameter, fallbackValue);
		},
		getNode() {
			return node;
		},
		helpers: { constructExecutionMetaData },
		continueOnFail: () => false,
	} as unknown as IExecuteFunctions;
	return fakeExecuteFunction;
};
