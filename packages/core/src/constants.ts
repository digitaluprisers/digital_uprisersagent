export const CUSTOM_EXTENSION_ENV = 'DIGITAL_UPRISERS_CUSTOM_EXTENSIONS';
export const PLACEHOLDER_EMPTY_EXECUTION_ID = '__UNKNOWN__';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';
export const HTTP_REQUEST_NODE_TYPE = 'Digital Uprisers-nodes-base.httpRequest';
export const HTTP_REQUEST_AS_TOOL_NODE_TYPE = 'Digital Uprisers-nodes-base.httpRequestTool';
export const HTTP_REQUEST_TOOL_NODE_TYPE = '@Digital Uprisers/Digital Uprisers-nodes-langchain.toolHttpRequest';

export const RESTRICT_FILE_ACCESS_TO = 'DIGITAL_UPRISERS_RESTRICT_FILE_ACCESS_TO';
export const BLOCK_FILE_ACCESS_TO_DIGITAL_UPRISERS_FILES = 'DIGITAL_UPRISERS_BLOCK_FILE_ACCESS_TO_DIGITAL_UPRISERS_FILES';
export const CONFIG_FILES = 'DIGITAL_UPRISERS_CONFIG_FILES';
export const BINARY_DATA_STORAGE_PATH = 'DIGITAL_UPRISERS_BINARY_DATA_STORAGE_PATH';
export const UM_EMAIL_TEMPLATES_INVITE = 'DIGITAL_UPRISERS_UM_EMAIL_TEMPLATES_INVITE';
export const UM_EMAIL_TEMPLATES_PWRESET = 'DIGITAL_UPRISERS_UM_EMAIL_TEMPLATES_PWRESET';

export const CREDENTIAL_ERRORS = {
	NO_DATA: 'No data is set on this credentials.',
	DECRYPTION_FAILED:
		'Credentials could not be decrypted. The likely reason is that a different "encryptionKey" was used to encrypt the data.',
	INVALID_JSON: 'Decrypted credentials data is not valid JSON.',
	INVALID_DATA: 'Credentials data is not in a valid format.',
};
