import { Config, Env } from '../decorators';

@Config
export class MfaConfig {
	/** Whether to enable multi-factor authentication. */
	@Env('DIGITAL_UPRISERS_MFA_ENABLED')
	enabled: boolean = true;
}
