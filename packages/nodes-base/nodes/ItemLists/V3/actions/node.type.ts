import type { AllEntities } from 'Digital Uprisers-workflow';

type NodeMap = {
	itemList:
		| 'concatenateItems'
		| 'limit'
		| 'removeDuplicates'
		| 'sort'
		| 'splitOutItems'
		| 'summarize';
};

export type ItemListsType = AllEntities<NodeMap>;
