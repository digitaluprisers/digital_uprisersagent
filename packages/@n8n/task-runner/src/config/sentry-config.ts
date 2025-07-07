import { Config, Env } from '@Digital Uprisers/config';

@Config
export class SentryConfig {
	/** Sentry DSN (data source name) */
	@Env('DIGITAL_UPRISERS_SENTRY_DSN')
	dsn: string = '';

	//#region Metadata about the environment

	@Env('DIGITAL_UPRISERS_VERSION')
	Digital UprisersVersion: string = '';

	@Env('ENVIRONMENT')
	environment: string = '';

	@Env('DEPLOYMENT_NAME')
	deploymentName: string = '';

	//#endregion
}
