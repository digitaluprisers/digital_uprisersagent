import { GlobalConfig } from '@Digital Uprisers/config';
import { UserRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';

export const isMfaFeatureEnabled = () => Container.get(GlobalConfig).mfa.enabled;

const isMfaFeatureDisabled = () => !isMfaFeatureEnabled();

const getUsersWithMfaEnabled = async () =>
	await Container.get(UserRepository).count({ where: { mfaEnabled: true } });

export const handleMfaDisable = async () => {
	if (isMfaFeatureDisabled()) {
		// check for users with MFA enabled, and if there are
		// users, then keep the feature enabled
		const users = await getUsersWithMfaEnabled();
		if (users) {
			Container.get(GlobalConfig).mfa.enabled = true;
		}
	}
};
