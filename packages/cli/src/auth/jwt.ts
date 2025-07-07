import type { User } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import type { Response } from 'express';

import { AuthService } from './auth.service';

// This method is still used by cloud hooks.
// DO NOT DELETE until the hooks have been updated
/** @deprecated Use `AuthService` instead */
export function issueCookie(res: Response, user: User) {
	return Container.get(AuthService).issueCookie(res, user, user.mfaEnabled);
}
