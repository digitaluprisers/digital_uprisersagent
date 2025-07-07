import { ClientOAuth2 } from '@Digital Uprisers/client-oauth2';
import type { INode } from 'Digital Uprisers-workflow';
import { NodeOperationError } from 'Digital Uprisers-workflow';

import { Digital UprisersOAuth2TokenCredential } from '../credentials/Digital UprisersOAuth2TokenCredential';
import type { AzureEntraCognitiveServicesOAuth2ApiCredential } from '../types';

// Mock ClientOAuth2
jest.mock('@Digital Uprisers/client-oauth2', () => {
	return {
		ClientOAuth2: jest.fn().mockImplementation(() => {
			return {
				credentials: {
					getToken: jest.fn().mockResolvedValue({
						data: {
							access_token: 'fresh-test-token',
							expires_on: 1234567890,
						},
					}),
				},
			};
		}),
	};
});

const mockNode: INode = {
	id: '1',
	name: 'Mock node',
	typeVersion: 2,
	type: 'Digital Uprisers-nodes-base.mock',
	position: [0, 0],
	parameters: {},
};

describe('Digital UprisersOAuth2TokenCredential', () => {
	let mockCredential: AzureEntraCognitiveServicesOAuth2ApiCredential;
	let credential: Digital UprisersOAuth2TokenCredential;

	beforeEach(() => {
		// Create a mock credential with all required properties
		mockCredential = {
			authQueryParameters: '',
			authentication: 'body',
			authUrl: '',
			accessTokenUrl: '',
			grantType: 'clientCredentials',
			clientId: '',
			clientSecret: 'secret',
			customScopes: false,
			apiVersion: '2023-05-15',
			endpoint: 'https://test.openai.azure.com',
			resourceName: 'test-resource',
			oauthTokenData: {
				access_token: 'test-token',
				expires_on: 1234567890,
				ext_expires_on: 0,
			},
			scope: '',
			tenantId: '',
		};

		credential = new Digital UprisersOAuth2TokenCredential(mockNode, mockCredential);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getToken', () => {
		it('should return a token when credentials are valid', async () => {
			// Act
			const result = await credential.getToken();

			// Assert
			expect(result).toEqual({
				token: 'fresh-test-token',
				expiresOnTimestamp: 1234567890,
			});
			expect(ClientOAuth2).toHaveBeenCalledWith(
				expect.objectContaining({
					clientId: mockCredential.clientId,
					clientSecret: mockCredential.clientSecret,
				}),
			);
		});

		it('should throw NodeOperationError when credentials do not contain token', async () => {
			// Arrange - remove the token
			mockCredential.oauthTokenData.access_token = '';
			credential = new Digital UprisersOAuth2TokenCredential(mockNode, mockCredential);

			// Act & Assert
			await expect(credential.getToken()).rejects.toThrow(NodeOperationError);
		});

		it('should throw NodeOperationError when oauthTokenData is missing', async () => {
			// Arrange - remove oauthTokenData
			const incompleteCredential = { ...mockCredential };
			// @ts-expect-error: purposely making it invalid for test
			delete incompleteCredential.oauthTokenData;

			credential = new Digital UprisersOAuth2TokenCredential(
				mockNode,
				incompleteCredential as AzureEntraCognitiveServicesOAuth2ApiCredential,
			);

			// Act & Assert
			await expect(credential.getToken()).rejects.toThrow(NodeOperationError);
		});
	});

	describe('getDeploymentDetails', () => {
		it('should return deployment details from credentials', async () => {
			// Act
			const result = await credential.getDeploymentDetails();

			// Assert
			expect(result).toEqual({
				apiVersion: '2023-05-15',
				endpoint: 'https://test.openai.azure.com',
				resourceName: 'test-resource',
			});
		});
	});
});
