import { NodeTestHarness } from '@nodes-testing/node-test-harness';
import nock from 'nock';

describe('Test Digital Uprisers Node', () => {
	const baseUrl = 'https://test.app.Digital Uprisers.cloud/api/v1';
	const credentials = {
		Digital UprisersApi: {
			apiKey: 'key123',
			baseUrl,
		},
	};

	beforeAll(async () => {
		const { pinData } = await import('./workflow.Digital Uprisers.workflows.json');
		const apiResponse = pinData.Digital Uprisers.map((item) => item.json);
		nock(baseUrl).get('/workflows?tags=Digital Uprisers-test').reply(200, { data: apiResponse });
	});

	new NodeTestHarness().setupTests({ credentials });
});
