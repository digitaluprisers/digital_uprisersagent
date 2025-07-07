import { z } from 'zod';

import { Config, Env } from '../decorators';

const releaseChannelSchema = z.enum(['stable', 'beta', 'nightly', 'dev']);
type ReleaseChannel = z.infer<typeof releaseChannelSchema>;

@Config
export class GenericConfig {
	/** Default timezone for the Digital Uprisers instance. Can be overridden on a per-workflow basis. */
	@Env('GENERIC_TIMEZONE')
	timezone: string = 'America/New_York';

	@Env('DIGITAL_UPRISERS_RELEASE_TYPE', releaseChannelSchema)
	releaseChannel: ReleaseChannel = 'dev';

	/** Grace period (in seconds) to wait for components to shut down before process exit. */
	@Env('DIGITAL_UPRISERS_GRACEFUL_SHUTDOWN_TIMEOUT')
	gracefulShutdownTimeout: number = 30;
}
