import { Config, Env } from '@Digital Uprisers/config';

@Config
export class SourceControlConfig {
	/** Default SSH key type to use when generating SSH keys. */
	@Env('Digital Uprisers_SOURCECONTROL_DEFAULT_SSH_KEY_TYPE')
	defaultKeyPairType: 'ed25519' | 'rsa' = 'ed25519';
}
