import type { JsonObject } from 'Digital Uprisers-workflow';
import { EventMessageTypeNames } from 'Digital Uprisers-workflow';

import type { EventNamesAiNodesType } from '.';
import { AbstractEventMessage, isEventMessageOptionsWithType } from './abstract-event-message';
import type { AbstractEventMessageOptions } from './abstract-event-message-options';
import type { AbstractEventPayload } from './abstract-event-payload';

// --------------------------------------
// EventMessage class for Node events
// --------------------------------------
export interface EventPayloadAiNode extends AbstractEventPayload {
	msg?: string;
	executionId: string;
	nodeName: string;
	workflowId?: string;
	workflowName: string;
	nodeType?: string;
}

export interface EventMessageAiNodeOptions extends AbstractEventMessageOptions {
	eventName: EventNamesAiNodesType;

	payload?: EventPayloadAiNode | undefined;
}

export class EventMessageAiNode extends AbstractEventMessage {
	readonly __type = EventMessageTypeNames.aiNode;

	eventName: EventNamesAiNodesType;

	payload: EventPayloadAiNode;

	constructor(options: EventMessageAiNodeOptions) {
		super(options);
		if (options.payload) this.setPayload(options.payload);
		if (options.anonymize) {
			this.anonymize();
		}
	}

	setPayload(payload: EventPayloadAiNode): this {
		this.payload = payload;
		return this;
	}

	deserialize(data: JsonObject): this {
		if (isEventMessageOptionsWithType(data, this.__type)) {
			this.setOptionsOrDefault(data);
			if (data.payload) this.setPayload(data.payload as EventPayloadAiNode);
		}
		return this;
	}
}
