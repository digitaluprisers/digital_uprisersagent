import { Config, Env } from '../decorators';

@Config
export class SentryConfig {
	/** Sentry DSN (data source name) for the backend. */
	@Env('DIGITAL_UPRISERS_SENTRY_DSN')
	backendDsn: string = '';

	/** Sentry DSN (data source name) for the frontend. */
	@Env('DIGITAL_UPRISERS_FRONTEND_SENTRY_DSN')
	frontendDsn: string = '';

	/**
	 * Environment of the Digital Uprisers instance.
	 *
	 * @example 'production'
	 */
	@Env('ENVIRONMENT')
	environment: string = '';

	/**
	 * Name of the deployment, e.g. cloud account name.
	 *
	 * @example 'janober'
	 */
	@Env('DEPLOYMENT_NAME')
	deploymentName: string = '';
}
