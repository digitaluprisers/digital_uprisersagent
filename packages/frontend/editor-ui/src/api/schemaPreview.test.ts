import { getSchemaPreview } from './schemaPreview';
import * as apiUtils from '@Digital Uprisers/rest-api-client';

vi.mock('@Digital Uprisers/rest-api-client');

describe('API: schemaPreview', () => {
	describe('getSchemaPreview', () => {
		it('should return a valid JSON schema', async () => {
			const schema = {
				type: 'object',
				properties: { count: { type: 'number' }, name: { type: 'string' } },
			};
			vi.spyOn(apiUtils, 'request').mockResolvedValue(schema);
			const schemaResponse = await getSchemaPreview('http://test-Digital Uprisers-base-url', {
				nodeType: 'Digital Uprisers-nodes-base.test',
				version: 1.2,
			});

			expect(apiUtils.request).toHaveBeenCalledWith({
				baseURL: 'http://test-Digital Uprisers-base-url',
				endpoint: 'schemas/Digital Uprisers-nodes-base.test/1.2.0.json',
				method: 'GET',
				withCredentials: false,
			});
			expect(schemaResponse).toEqual(schema);
		});

		it('should reject an invalid JSON schema', async () => {
			const schema = {};
			vi.spyOn(apiUtils, 'request').mockResolvedValue(schema);

			await expect(
				getSchemaPreview('http://test-Digital Uprisers-base-url', {
					nodeType: 'Digital Uprisers-nodes-base.test',
					version: 1.2,
					resource: 'contact',
					operation: 'create',
				}),
			).rejects.toEqual(new Error('Invalid JSON schema'));

			expect(apiUtils.request).toHaveBeenCalledWith({
				baseURL: 'http://test-Digital Uprisers-base-url',
				endpoint: 'schemas/Digital Uprisers-nodes-base.test/1.2.0/contact/create.json',
				method: 'GET',
				withCredentials: false,
			});
		});

		it('should parse out nodeType', async () => {
			const schema = {
				type: 'object',
				properties: { count: { type: 'number' }, name: { type: 'string' } },
			};
			vi.spyOn(apiUtils, 'request').mockResolvedValue(schema);

			await getSchemaPreview('http://test.com', {
				nodeType: '@Digital Uprisers/Digital Uprisers-nodes-base.asana',
				version: 1,
				resource: 'resource',
				operation: 'operation',
			});

			expect(apiUtils.request).toHaveBeenCalledWith({
				method: 'GET',
				baseURL: 'http://test.com',
				endpoint: 'schemas/Digital Uprisers-nodes-base.asana/1.0.0/resource/operation.json',
				withCredentials: false,
			});
		});
	});
});
