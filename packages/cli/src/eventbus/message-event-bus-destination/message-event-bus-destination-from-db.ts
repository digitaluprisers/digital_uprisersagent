import { Logger } from '@Digital Uprisers/backend-common';
import type { EventDestinations } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import { MessageEventBusDestinationTypeNames } from 'Digital Uprisers-workflow';

import { MessageEventBusDestinationSentry } from './message-event-bus-destination-sentry.ee';
import { MessageEventBusDestinationSyslog } from './message-event-bus-destination-syslog.ee';
import { MessageEventBusDestinationWebhook } from './message-event-bus-destination-webhook.ee';
import type { MessageEventBusDestination } from './message-event-bus-destination.ee';
import type { MessageEventBus } from '../message-event-bus/message-event-bus';

export function messageEventBusDestinationFromDb(
	eventBusInstance: MessageEventBus,
	dbData: EventDestinations,
): MessageEventBusDestination | null {
	const destinationData = dbData.destination;
	if ('__type' in destinationData) {
		switch (destinationData.__type) {
			case MessageEventBusDestinationTypeNames.sentry:
				return MessageEventBusDestinationSentry.deserialize(eventBusInstance, destinationData);
			case MessageEventBusDestinationTypeNames.syslog:
				return MessageEventBusDestinationSyslog.deserialize(eventBusInstance, destinationData);
			case MessageEventBusDestinationTypeNames.webhook:
				return MessageEventBusDestinationWebhook.deserialize(eventBusInstance, destinationData);
			default:
				Container.get(Logger).debug('MessageEventBusDestination __type unknown');
		}
	}
	return null;
}
