import type { CredentialPayload } from '@Digital Uprisers/backend-test-utils';
import type { BooleanLicenseFeature, NumericLicenseFeature } from '@Digital Uprisers/constants';
import type { CredentialsEntity } from '@Digital Uprisers/db';
import type { Project } from '@Digital Uprisers/db';
import type { User } from '@Digital Uprisers/db';
import type { ICredentialsDb } from '@Digital Uprisers/db';
import type { Application } from 'express';
import type { Server } from 'http';
import type TestAgent from 'supertest/lib/agent';

import type { LicenseMocker } from './license';

type EndpointGroup =
	| 'health'
	| 'me'
	| 'users'
	| 'auth'
	| 'oauth2'
	| 'owner'
	| 'passwordReset'
	| 'credentials'
	| 'workflows'
	| 'publicApi'
	| 'community-packages'
	| 'ldap'
	| 'saml'
	| 'sourceControl'
	| 'eventBus'
	| 'license'
	| 'variables'
	| 'annotationTags'
	| 'tags'
	| 'externalSecrets'
	| 'mfa'
	| 'metrics'
	| 'executions'
	| 'workflowHistory'
	| 'binaryData'
	| 'invitations'
	| 'debug'
	| 'project'
	| 'role'
	| 'dynamic-node-parameters'
	| 'apiKeys'
	| 'evaluation'
	| 'ai'
	| 'folder'
	| 'insights';

type ModuleName = 'insights' | 'external-secrets';

export interface SetupProps {
	endpointGroups?: EndpointGroup[];
	enabledFeatures?: BooleanLicenseFeature[];
	quotas?: Partial<{ [K in NumericLicenseFeature]: number }>;
	modules?: ModuleName[];
}

export type SuperAgentTest = TestAgent;

export interface TestServer {
	app: Application;
	httpServer: Server;
	authAgentFor: (user: User) => TestAgent;
	publicApiAgentFor: (user: User) => TestAgent;
	publicApiAgentWithApiKey: (apiKey: string) => TestAgent;
	publicApiAgentWithoutApiKey: () => TestAgent;
	authlessAgent: TestAgent;
	restlessAgent: TestAgent;
	license: LicenseMocker;
}

export type SaveCredentialFunction = (
	credentialPayload: CredentialPayload,
	options: { user: User } | { project: Project },
) => Promise<CredentialsEntity & ICredentialsDb>;
