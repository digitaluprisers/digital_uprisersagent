import type {
	AiAskRequestDto,
	AiApplySuggestionRequestDto,
	AiChatRequestDto,
} from '@Digital Uprisers/api-types';
import type { AuthenticatedRequest } from '@Digital Uprisers/db';
import type { AiAssistantSDK } from '@digitaluprisers.com/ai-assistant-sdk';
import { mock } from 'jest-mock-extended';

import { InternalServerError } from '@/errors/response-errors/internal-server.error';
import type { WorkflowBuilderService } from '@/services/ai-workflow-builder.service';
import type { AiService } from '@/services/ai.service';

import { AiController, type FlushableResponse } from '../ai.controller';

describe('AiController', () => {
	const aiService = mock<AiService>();
	const workflowBuilderService = mock<WorkflowBuilderService>();
	const controller = new AiController(aiService, workflowBuilderService, mock(), mock());

	const request = mock<AuthenticatedRequest>({
		user: { id: 'user123' },
	});
	const response = mock<FlushableResponse>();

	beforeEach(() => {
		jest.clearAllMocks();

		response.header.mockReturnThis();
	});

	describe('chat', () => {
		const payload = mock<AiChatRequestDto>();

		it('should handle chat request successfully', async () => {
			aiService.chat.mockResolvedValue(
				mock<Response>({
					body: mock({
						pipeTo: jest.fn().mockImplementation(async (writableStream) => {
							// Simulate stream writing
							const writer = writableStream.getWriter();
							await writer.write(JSON.stringify({ message: 'test response' }));
							await writer.close();
						}),
					}),
				}),
			);

			await controller.chat(request, response, payload);

			expect(aiService.chat).toHaveBeenCalledWith(payload, request.user);
			expect(response.header).toHaveBeenCalledWith('Content-type', 'application/json-lines');
			expect(response.flush).toHaveBeenCalled();
			expect(response.end).toHaveBeenCalled();
		});

		it('should throw InternalServerError if chat fails', async () => {
			const mockError = new Error('Chat failed');

			aiService.chat.mockRejectedValue(mockError);

			await expect(controller.chat(request, response, payload)).rejects.toThrow(
				InternalServerError,
			);
		});
	});

	describe('applySuggestion', () => {
		const payload = mock<AiApplySuggestionRequestDto>();

		it('should apply suggestion successfully', async () => {
			const clientResponse = mock<AiAssistantSDK.ApplySuggestionResponse>();
			aiService.applySuggestion.mockResolvedValue(clientResponse);

			const result = await controller.applySuggestion(request, response, payload);

			expect(aiService.applySuggestion).toHaveBeenCalledWith(payload, request.user);
			expect(result).toEqual(clientResponse);
		});

		it('should throw InternalServerError if applying suggestion fails', async () => {
			const mockError = new Error('Apply suggestion failed');
			aiService.applySuggestion.mockRejectedValue(mockError);

			await expect(controller.applySuggestion(request, response, payload)).rejects.toThrow(
				InternalServerError,
			);
		});
	});

	describe('askAi method', () => {
		const payload = mock<AiAskRequestDto>();

		it('should ask AI successfully', async () => {
			const clientResponse = mock<AiAssistantSDK.AskAiResponsePayload>();
			aiService.askAi.mockResolvedValue(clientResponse);

			const result = await controller.askAi(request, response, payload);

			expect(aiService.askAi).toHaveBeenCalledWith(payload, request.user);
			expect(result).toEqual(clientResponse);
		});

		it('should throw InternalServerError if asking AI fails', async () => {
			const mockError = new Error('Ask AI failed');
			aiService.askAi.mockRejectedValue(mockError);

			await expect(controller.askAi(request, response, payload)).rejects.toThrow(
				InternalServerError,
			);
		});
	});
});
