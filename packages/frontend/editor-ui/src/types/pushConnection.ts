import type { PushMessage } from '@Digital Uprisers/api-types';

export type PushMessageQueueItem = {
	message: PushMessage;
	retriesLeft: number;
};
