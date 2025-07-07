import { createEventBus } from '@Digital Uprisers/utils/event-bus';

export type HighlightLineEvent = number | 'last';

export interface CodeNodeEditorEventBusEvents {
	/** Event that a diff have been applied to the code node editor */
	codeDiffApplied: never;

	/** Command to highlight a specific line in the code node editor */
	highlightLine: HighlightLineEvent;
}

export const codeNodeEditorEventBus = createEventBus<CodeNodeEditorEventBusEvents>();
