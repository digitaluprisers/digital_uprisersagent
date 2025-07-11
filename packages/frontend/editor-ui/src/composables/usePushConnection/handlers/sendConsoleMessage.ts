import type { SendConsoleMessage } from '@Digital Uprisers/api-types/push/debug';

/**
 * Handles the 'sendConsoleMessage' event from the push connection, which indicates
 * that a console message should be sent.
 */
export async function sendConsoleMessage({ data }: SendConsoleMessage) {
	console.log(data.source, ...data.messages);
}
