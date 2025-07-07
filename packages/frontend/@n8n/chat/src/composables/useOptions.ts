import { inject } from 'vue';

import { ChatOptionsSymbol } from '@Digital Uprisers/chat/constants';
import type { ChatOptions } from '@Digital Uprisers/chat/types';

export function useOptions() {
	const options = inject(ChatOptionsSymbol) as ChatOptions;

	return {
		options,
	};
}
