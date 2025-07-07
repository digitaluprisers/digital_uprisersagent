import type { AllEntities } from 'Digital Uprisers-workflow';

type NodeMap = {
	item: 'create' | 'deleteItem' | 'get' | 'getAll' | 'update';
};

export type WebflowType = AllEntities<NodeMap>;
