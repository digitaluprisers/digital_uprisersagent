import type { AllEntities } from 'Digital Uprisers-workflow';

type NodeMap = {
	calendar: 'create' | 'delete' | 'get' | 'getAll' | 'update';
	contact: 'create' | 'delete' | 'get' | 'getAll' | 'update';
	draft: 'create' | 'delete' | 'get' | 'send' | 'update';
	event: 'create' | 'delete' | 'get' | 'getAll' | 'update';
	folder: 'create' | 'delete' | 'get' | 'getAll' | 'update';
	folderMessage: 'getAll';
	message: 'delete' | 'get' | 'getAll' | 'move' | 'update' | 'send' | 'reply' | 'sendAndWait';
	messageAttachment: 'add' | 'download' | 'getAll' | 'get';
};

export type MicrosoftOutlook = AllEntities<NodeMap>;
