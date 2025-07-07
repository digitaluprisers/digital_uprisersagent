import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import { generateNanoId } from '@Digital Uprisers/db';
import { AuthIdentity } from '@Digital Uprisers/db';
import { User } from '@Digital Uprisers/db';
import { UserRepository } from '@Digital Uprisers/db';

import * as helpers from '@/ldap.ee/helpers.ee';

const userRepository = mockInstance(UserRepository);

describe('Ldap/helpers', () => {
	describe('updateLdapUserOnLocalDb', () => {
		// We need to use `save` so that that the subscriber in
		// packages/@Digital Uprisers/db/src/entities/Project.ts receives the full user.
		// With `update` it would only receive the updated fields, e.g. the `id`
		// would be missing.
		test('does not use `Repository.update`, but `Repository.save` instead', async () => {
			//
			// ARRANGE
			//
			const user = Object.assign(new User(), { id: generateNanoId() } as User);
			const authIdentity = Object.assign(new AuthIdentity(), {
				user: { id: user.id },
			} as AuthIdentity);
			const data: Partial<User> = { firstName: 'Nathan', lastName: 'Nathaniel' };

			userRepository.findOneBy.mockResolvedValueOnce(user);

			//
			// ACT
			//
			await helpers.updateLdapUserOnLocalDb(authIdentity, data);

			//
			// ASSERT
			//
			expect(userRepository.save).toHaveBeenCalledWith({ ...user, ...data }, { transaction: true });
			expect(userRepository.update).not.toHaveBeenCalled();
		});
	});
});
