import type { SamlPreferences } from '@Digital Uprisers/api-types';

export type SamlLoginBinding = SamlPreferences['loginBinding'];
export type SamlAttributeMapping = NonNullable<SamlPreferences['mapping']>;
export type SamlUserAttributes = SamlAttributeMapping;
