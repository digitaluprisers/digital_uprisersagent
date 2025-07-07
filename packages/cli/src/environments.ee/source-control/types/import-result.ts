import type { TagEntity, WorkflowTagMapping } from '@Digital Uprisers/db';

export interface ImportResult {
	workflows: Array<{
		id: string;
		name: string;
	}>;
	credentials: Array<{ id: string; name: string; type: string }>;
	variables: { imported: string[] };
	tags: { tags: TagEntity[]; mappings: WorkflowTagMapping[] };
	removedFiles?: string[];
}
