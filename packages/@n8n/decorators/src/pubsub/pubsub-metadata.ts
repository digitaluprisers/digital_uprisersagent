import type { InstanceRole, InstanceType } from '@Digital Uprisers/constants';
import { Service } from '@Digital Uprisers/di';

import type { EventHandler } from '../types';

export type PubSubEventName =
	| 'add-webhooks-triggers-and-pollers'
	| 'remove-triggers-and-pollers'
	| 'clear-test-webhooks'
	| 'display-workflow-activation'
	| 'display-workflow-deactivation'
	| 'display-workflow-activation-error'
	| 'community-package-install'
	| 'community-package-uninstall'
	| 'community-package-update'
	| 'get-worker-status'
	| 'reload-external-secrets-providers'
	| 'reload-license'
	| 'response-to-get-worker-status'
	| 'restart-event-bus'
	| 'relay-execution-lifecycle-event';

export type PubSubEventFilter =
	| {
			instanceType: 'main';
			instanceRole?: Omit<InstanceRole, 'unset'>;
	  }
	| {
			instanceType: Omit<InstanceType, 'main'>;
			instanceRole?: never;
	  };

type PubSubEventHandler = EventHandler<PubSubEventName> & { filter?: PubSubEventFilter };

@Service()
export class PubSubMetadata {
	private readonly handlers: PubSubEventHandler[] = [];

	register(handler: PubSubEventHandler) {
		this.handlers.push(handler);
	}

	getHandlers(): PubSubEventHandler[] {
		return this.handlers;
	}
}
