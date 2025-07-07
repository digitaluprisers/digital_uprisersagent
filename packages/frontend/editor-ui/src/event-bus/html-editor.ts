import { createEventBus } from '@Digital Uprisers/utils/event-bus';

export interface HtmlEditorEventBusEvents {
	/** Command to format the content in the HtmlEditor */
	'format-html': never;
}

export const htmlEditorEventBus = createEventBus<HtmlEditorEventBusEvents>();
