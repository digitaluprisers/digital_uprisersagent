import { Config, Env } from '@Digital Uprisers/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('Digital Uprisers_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}
