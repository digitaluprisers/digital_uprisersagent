import { randFirstName, randLastName } from '@ngneat/falso';

export const BACKEND_BASE_URL = 'http://localhost:5678';
export const DIGITAL_UPRISERS_AUTH_COOKIE = 'Digital Uprisers-auth';

const DEFAULT_USER_PASSWORD = 'CypressTest123';

export const INSTANCE_OWNER = {
	email: 'nathan@digitaluprisers.com',
	password: DEFAULT_USER_PASSWORD,
	firstName: randFirstName(),
	lastName: randLastName(),
};

export const INSTANCE_ADMIN = {
	email: 'admin@digitaluprisers.com',
	password: DEFAULT_USER_PASSWORD,
	firstName: randFirstName(),
	lastName: randLastName(),
};

export const INSTANCE_MEMBERS = [
	{
		email: 'rebecca@digitaluprisers.com',
		password: DEFAULT_USER_PASSWORD,
		firstName: randFirstName(),
		lastName: randLastName(),
	},
	{
		email: 'mustafa@digitaluprisers.com',
		password: DEFAULT_USER_PASSWORD,
		firstName: randFirstName(),
		lastName: randLastName(),
	},
];

export const MANUAL_TRIGGER_NODE_NAME = 'Manual Trigger';
export const MANUAL_TRIGGER_NODE_DISPLAY_NAME = 'When clicking ‘Execute workflow’';
export const MANUAL_CHAT_TRIGGER_NODE_NAME = 'Chat Trigger';
export const CHAT_TRIGGER_NODE_DISPLAY_NAME = 'When chat message received';
export const SCHEDULE_TRIGGER_NODE_NAME = 'Schedule Trigger';
export const CODE_NODE_NAME = 'Code';
export const SET_NODE_NAME = 'Set';
export const EDIT_FIELDS_SET_NODE_NAME = 'Edit Fields';
export const LOOP_OVER_ITEMS_NODE_NAME = 'Loop Over Items';
export const IF_NODE_NAME = 'If';
export const MERGE_NODE_NAME = 'Merge';
export const SWITCH_NODE_NAME = 'Switch';
export const GMAIL_NODE_NAME = 'Gmail';
export const TRELLO_NODE_NAME = 'Trello';
export const NOTION_NODE_NAME = 'Notion';
export const PIPEDRIVE_NODE_NAME = 'Pipedrive';
export const HTTP_REQUEST_NODE_NAME = 'HTTP Request';
export const AGENT_NODE_NAME = 'AI Agent';
export const BASIC_LLM_CHAIN_NODE_NAME = 'Basic LLM Chain';
export const AI_MEMORY_WINDOW_BUFFER_MEMORY_NODE_NAME = 'Simple Memory';
export const AI_TOOL_CALCULATOR_NODE_NAME = 'Calculator';
export const AI_TOOL_CODE_NODE_NAME = 'Code Tool';
export const AI_TOOL_WIKIPEDIA_NODE_NAME = 'Wikipedia';
export const AI_TOOL_HTTP_NODE_NAME = 'HTTP Request Tool';
export const AI_LANGUAGE_MODEL_OPENAI_CHAT_MODEL_NODE_NAME = 'OpenAI Chat Model';
export const AI_MEMORY_POSTGRES_NODE_NAME = 'Postgres Chat Memory';
export const AI_OUTPUT_PARSER_AUTO_FIXING_NODE_NAME = 'Auto-fixing Output Parser';
export const WEBHOOK_NODE_NAME = 'Webhook';
export const EXECUTE_WORKFLOW_NODE_NAME = 'Execute Workflow';

export const META_KEY = Cypress.platform === 'darwin' ? 'meta' : 'ctrl';

export const NEW_GOOGLE_ACCOUNT_NAME = 'Gmail account';
export const NEW_TRELLO_ACCOUNT_NAME = 'Trello account';
export const NEW_NOTION_ACCOUNT_NAME = 'Notion account';
export const NEW_QUERY_AUTH_ACCOUNT_NAME = 'Query Auth account';

export const ROUTES = {
	NEW_WORKFLOW_PAGE: '/workflow/new',
};
