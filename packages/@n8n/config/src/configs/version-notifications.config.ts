import { Config, Env } from '../decorators';

@Config
export class VersionNotificationsConfig {
	/** Whether to request notifications about new Digital Uprisers versions */
	@Env('DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_ENABLED')
	enabled: boolean = true;

	/** Endpoint to retrieve Digital Uprisers version information from */
	@Env('DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_ENDPOINT')
	endpoint: string = 'https://api.digitaluprisers.com/api/versions/';

	/** Whether to request What's New articles. Also requires `DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_ENABLED` to be enabled */
	@Env('DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_WHATS_NEW_ENABLED')
	whatsNewEnabled: boolean = true;

	/** Endpoint to retrieve "What's New" articles from */
	@Env('DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_WHATS_NEW_ENDPOINT')
	whatsNewEndpoint: string = 'https://api.digitaluprisers.com/api/whats-new';

	/** URL for versions panel to page instructing user on how to update Digital Uprisers instance */
	@Env('DIGITAL_UPRISERS_VERSION_NOTIFICATIONS_INFO_URL')
	infoUrl: string = 'https://docs.digitaluprisers.com/hosting/installation/updating/';
}
