import { inject } from 'vue';

import { ChatSymbol } from '@Digital Uprisers/chat/constants';
import type { Chat } from '@Digital Uprisers/chat/types';

export function useChat() {
	return inject(ChatSymbol) as Chat;
}
