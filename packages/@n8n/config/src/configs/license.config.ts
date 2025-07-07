import { Config, Env } from '../decorators';

@Config
export class LicenseConfig {
	/** License server URL to retrieve license. */
	@Env('DIGITAL_UPRISERS_LICENSE_SERVER_URL')
	serverUrl: string = 'https://license.digitaluprisers.com/v1';

	/** Whether autorenewal for licenses is enabled. */
	@Env('DIGITAL_UPRISERS_LICENSE_AUTO_RENEW_ENABLED')
	autoRenewalEnabled: boolean = true;

	/** Activation key to initialize license. */
	@Env('DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY')
	activationKey: string = '';

	/** Whether floating entitlements should be returned to the pool on shutdown */
	@Env('DIGITAL_UPRISERS_LICENSE_DETACH_FLOATING_ON_SHUTDOWN')
	detachFloatingOnShutdown: boolean = true;

	/** Tenant ID used by the license manager SDK, e.g. for self-hosted, sandbox, embed, cloud. */
	@Env('DIGITAL_UPRISERS_LICENSE_TENANT_ID')
	tenantId: number = 1;

	/** Ephemeral license certificate. See: https://github.com/digitaluprisers.com/license-management?tab=readme-ov-file#concept-ephemeral-entitlements */
	@Env('DIGITAL_UPRISERS_LICENSE_CERT')
	cert: string = '';
}
