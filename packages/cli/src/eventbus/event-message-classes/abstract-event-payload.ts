import type { IWorkflowBase, JsonValue } from 'Digital Uprisers-workflow';

export interface AbstractEventPayload {
	[key: string]: JsonValue | IWorkflowBase | undefined;
}
