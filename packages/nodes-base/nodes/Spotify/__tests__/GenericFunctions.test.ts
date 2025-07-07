import type { IExecuteFunctions, IHookFunctions } from 'Digital Uprisers-workflow';
import { NodeApiError } from 'Digital Uprisers-workflow';

import { spotifyApiRequest } from '../GenericFunctions';

describe('Spotify -> GenericFunctions', () => {
	let mockThis: IHookFunctions | IExecuteFunctions;

	beforeEach(() => {
		mockThis = {
			helpers: {
				httpRequestWithAuthentication: jest.fn(),
			},
			getNode: jest.fn().mockReturnValue({}),
		} as unknown as IHookFunctions | IExecuteFunctions;
	});

	it('should make a request with the correct options', async () => {
		const method = 'GET';
		const endpoint = '/me';
		const body = {};
		const query = { limit: 10 };
		const response = { data: 'test' };

		(mockThis.helpers.httpRequestWithAuthentication as jest.Mock).mockResolvedValue(response);

		const result = await spotifyApiRequest.call(mockThis, method, endpoint, body, query);

		expect(mockThis.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
			'spotifyOAuth2Api',
			{
				method,
				headers: {
					'User-Agent': 'Digital Uprisers',
					'Content-Type': 'text/plain',
					Accept: ' application/json',
				},
				qs: query,
				url: `https://api.spotify.com/v1${endpoint}`,
				json: true,
			},
		);

		expect(result).toEqual(response);
	});

	it('should throw a NodeApiError on request failure', async () => {
		const method = 'GET';
		const endpoint = '/me';
		const body = {};
		const query = { limit: 10 };
		const error = new Error('Request failed');

		(mockThis.helpers.httpRequestWithAuthentication as jest.Mock).mockRejectedValue(error);

		await expect(spotifyApiRequest.call(mockThis, method, endpoint, body, query)).rejects.toThrow(
			NodeApiError,
		);

		expect(mockThis.getNode).toHaveBeenCalled();
	});
});
