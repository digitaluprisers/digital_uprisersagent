import { Factory } from 'miragejs';
import type { ICredentialType } from 'Digital Uprisers-workflow';

const credentialTypes = [
	'airtableApi',
	'dropboxApi',
	'figmaApi',
	'googleApi',
	'gitlabApi',
	'jenkinsApi',
	'metabaseApi',
	'notionApi',
];

export const credentialTypeFactory = Factory.extend<ICredentialType>({
	name(i) {
		return credentialTypes[i];
	},
	displayName(i) {
		return credentialTypes[i];
	},
	properties() {
		return [];
	},
});
