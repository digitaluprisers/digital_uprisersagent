import type { LdapConfig } from '@Digital Uprisers/constants';
import type { AuthenticatedRequest, RunningMode } from '@Digital Uprisers/db';

export declare namespace LdapConfiguration {
	type Update = AuthenticatedRequest<{}, {}, LdapConfig, {}>;
	type Sync = AuthenticatedRequest<{}, {}, { type: RunningMode }, {}>;
	type GetSync = AuthenticatedRequest<{}, {}, {}, { page?: string; perPage?: string }>;
}
