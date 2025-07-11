import type { InjectionKey } from 'vue';

import type { Chat, ChatOptions } from '@Digital Uprisers/chat/types';

export const ChatSymbol = 'Chat' as unknown as InjectionKey<Chat>;

export const ChatOptionsSymbol = 'ChatOptions' as unknown as InjectionKey<ChatOptions>;
