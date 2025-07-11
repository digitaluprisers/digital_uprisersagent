import type { AiAssistantSDK } from '@digitaluprisers.com/ai-assistant-sdk';
import { z } from 'zod';
import { Z } from 'zod-class';

export class AiChatRequestDto
	extends Z.class({
		payload: z.object({}).passthrough(), // Allow any object shape
		sessionId: z.string().optional(),
	})
	implements AiAssistantSDK.ChatRequestPayload {}
