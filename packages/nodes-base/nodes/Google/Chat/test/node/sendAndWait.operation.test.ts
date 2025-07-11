import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { type INode, SEND_AND_WAIT_OPERATION, type IExecuteFunctions } from 'Digital Uprisers-workflow';

import * as genericFunctions from '../../GenericFunctions';
import { GoogleChat } from '../../GoogleChat.node';

jest.mock('../../GenericFunctions', () => {
	const originalModule = jest.requireActual('../../GenericFunctions');
	return {
		...originalModule,
		googleApiRequest: jest.fn(),
	};
});

describe('Test GoogleChat, message => sendAndWait', () => {
	let googleChat: GoogleChat;
	let mockExecuteFunctions: MockProxy<IExecuteFunctions>;

	beforeEach(() => {
		googleChat = new GoogleChat();
		mockExecuteFunctions = mock<IExecuteFunctions>();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should send message and put execution to wait', async () => {
		const items = [{ json: { data: 'test' } }];
		//node
		mockExecuteFunctions.getInputData.mockReturnValue(items);
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('message');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(SEND_AND_WAIT_OPERATION);
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('spaceID');
		mockExecuteFunctions.getNode.mockReturnValue(mock<INode>());
		mockExecuteFunctions.getInstanceId.mockReturnValue('instanceId');

		//getSendAndWaitConfig
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('my message');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('my subject');
		mockExecuteFunctions.evaluateExpression.mockReturnValueOnce('http://localhost/waiting-webhook');
		mockExecuteFunctions.evaluateExpression.mockReturnValueOnce('nodeID');
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce({}); // approvalOptions
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce({}); // options
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('approval');

		// configureWaitTillDate
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce({}); //options.limitWaitTime.values

		const result = await googleChat.execute.call(mockExecuteFunctions);

		expect(result).toEqual([items]);
		expect(genericFunctions.googleApiRequest).toHaveBeenCalledTimes(1);
		expect(mockExecuteFunctions.putExecutionToWait).toHaveBeenCalledTimes(1);

		expect(genericFunctions.googleApiRequest).toHaveBeenCalledWith('POST', '/v1/spaceID/messages', {
			text: 'my message\n\n\n*<http://localhost/waiting-webhook/nodeID?approved=true|Approve>*\n\n_This_ _message_ _was_ _sent_ _automatically_ _with_ _<https://digitaluprisers.com/?utm_source=Digital Uprisers-internal&utm_medium=powered_by&utm_campaign=Digital Uprisers-nodes-base.googleChat_instanceId|Digital Uprisers>_',
		});
	});
});
