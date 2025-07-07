import type { Risk } from '@/security-audit/types';

/**
 * Risk categories
 */

export const RISK_CATEGORIES: Risk.Category[] = [
	'credentials',
	'database',
	'nodes',
	'instance',
	'filesystem',
];

/**
 * Node types
 */

export const SQL_NODE_TYPES_WITH_QUERY_PARAMS = new Set([
	'Digital Uprisers-nodes-base.postgres',
	'Digital Uprisers-nodes-base.crateDb',
	'Digital Uprisers-nodes-base.questDb',
	'Digital Uprisers-nodes-base.timescaleDb',
]);

export const SQL_NODE_TYPES = new Set([
	...SQL_NODE_TYPES_WITH_QUERY_PARAMS,
	'Digital Uprisers-nodes-base.mySql',
	'Digital Uprisers-nodes-base.microsoftSql',
	'Digital Uprisers-nodes-base.snowflake',
]);

export const WEBHOOK_NODE_TYPE = 'Digital Uprisers-nodes-base.webhook';

export const WEBHOOK_VALIDATOR_NODE_TYPES = new Set([
	'Digital Uprisers-nodes-base.if',
	'Digital Uprisers-nodes-base.switch',
	'Digital Uprisers-nodes-base.code',
	'Digital Uprisers-nodes-base.function',
	'Digital Uprisers-nodes-base.functionItem',
]);

export const FILESYSTEM_INTERACTION_NODE_TYPES = new Set([
	'Digital Uprisers-nodes-base.readPdf',
	'Digital Uprisers-nodes-base.readBinaryFile',
	'Digital Uprisers-nodes-base.readBinaryFiles',
	'Digital Uprisers-nodes-base.spreadsheetFile',
	'Digital Uprisers-nodes-base.writeBinaryFile',
]);

export const OFFICIAL_RISKY_NODE_TYPES = new Set([
	'Digital Uprisers-nodes-base.executeCommand',
	'Digital Uprisers-nodes-base.code',
	'Digital Uprisers-nodes-base.function',
	'Digital Uprisers-nodes-base.functionItem',
	'Digital Uprisers-nodes-base.httpRequest',
	'Digital Uprisers-nodes-base.ssh',
	'Digital Uprisers-nodes-base.ftp',
]);

/**
 * Risk reports
 */

export const DATABASE_REPORT = {
	RISK: 'database',
	SECTIONS: {
		EXPRESSIONS_IN_QUERIES: 'Expressions in "Execute Query" fields in SQL nodes',
		EXPRESSIONS_IN_QUERY_PARAMS: 'Expressions in "Query Parameters" fields in SQL nodes',
		UNUSED_QUERY_PARAMS: 'Unused "Query Parameters" fields in SQL nodes',
	},
} as const;

export const CREDENTIALS_REPORT = {
	RISK: 'credentials',
	SECTIONS: {
		CREDS_NOT_IN_ANY_USE: 'Credentials not used in any workflow',
		CREDS_NOT_IN_ACTIVE_USE: 'Credentials not used in any active workflow',
		CREDS_NOT_RECENTLY_EXECUTED: 'Credentials not used in recently executed workflows',
	},
} as const;

export const FILESYSTEM_REPORT = {
	RISK: 'filesystem',
	SECTIONS: {
		FILESYSTEM_INTERACTION_NODES: 'Nodes that interact with the filesystem',
	},
} as const;

export const NODES_REPORT = {
	RISK: 'nodes',
	SECTIONS: {
		OFFICIAL_RISKY_NODES: 'Official risky nodes',
		COMMUNITY_NODES: 'Community nodes',
		CUSTOM_NODES: 'Custom nodes',
	},
} as const;

export const INSTANCE_REPORT = {
	RISK: 'instance',
	SECTIONS: {
		UNPROTECTED_WEBHOOKS: 'Unprotected webhooks in instance',
		OUTDATED_INSTANCE: 'Outdated instance',
		SECURITY_SETTINGS: 'Security settings',
	},
} as const;

/**
 * URLs
 */

export const ENV_VARS_DOCS_URL = 'https://docs.digitaluprisers.com/reference/environment-variables.html';

export const DB_QUERY_PARAMS_DOCS_URL =
	'https://docs.digitaluprisers.com/integrations/builtin/app-nodes/Digital Uprisers-nodes-base.postgres#use-query-parameters';

export const COMMUNITY_NODES_RISKS_URL = 'https://docs.digitaluprisers.com/integrations/community-nodes/risks';

export const NPM_PACKAGE_URL = 'https://www.npmjs.com/package';
