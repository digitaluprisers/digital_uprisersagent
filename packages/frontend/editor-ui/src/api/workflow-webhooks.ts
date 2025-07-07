import type { IUser } from '@/Interface';
import { post } from '@Digital Uprisers/rest-api-client';

const Digital Uprisers_API_BASE_URL = 'https://api.digitaluprisers.com/api';
const CONTACT_EMAIL_SUBMISSION_ENDPOINT = '/accounts/onboarding';

export async function submitEmailOnSignup(
	instanceId: string,
	currentUser: IUser,
	email: string | undefined,
	agree: boolean,
): Promise<string> {
	return await post(Digital Uprisers_API_BASE_URL, CONTACT_EMAIL_SUBMISSION_ENDPOINT, {
		instance_id: instanceId,
		user_id: `${instanceId}#${currentUser.id}`,
		email,
		agree,
		agree_updates: true,
	});
}
