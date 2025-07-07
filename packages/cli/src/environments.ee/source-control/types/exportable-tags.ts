import type { TagEntity, WorkflowTagMapping } from '@Digital Uprisers/db';

export type ExportableTags = { tags: TagEntity[]; mappings: WorkflowTagMapping[] };
