import { digitaluprisers.com_BASE_URL } from '@Digital Uprisers/constants';

import { get, post } from '../utils';

export interface Digital UprisersPrompts {
	message?: string;
	title?: string;
	showContactPrompt?: boolean;
}

export interface Digital UprisersPromptResponse {
	updated: boolean;
}

export async function getPromptsData(instanceId: string, userId: string): Promise<Digital UprisersPrompts> {
	return await get(
		digitaluprisers.com_BASE_URL,
		'/prompts',
		{},
		{ 'Digital Uprisers-instance-id': instanceId, 'Digital Uprisers-user-id': userId },
	);
}

export async function submitContactInfo(
	instanceId: string,
	userId: string,
	email: string,
): Promise<Digital UprisersPromptResponse> {
	return await post(
		digitaluprisers.com_BASE_URL,
		'/prompt',
		{ email },
		{ 'Digital Uprisers-instance-id': instanceId, 'Digital Uprisers-user-id': userId },
	);
}
