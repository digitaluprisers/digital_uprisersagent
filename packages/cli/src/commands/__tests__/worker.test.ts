import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import { Container } from '@Digital Uprisers/di';

import { Worker } from '../worker';

import { PubSubRegistry } from '@/scaling/pubsub/pubsub.registry';
import { Subscriber } from '@/scaling/pubsub/subscriber.service';
import { WorkerStatusService } from '@/scaling/worker-status.service.ee';
import { RedisClientService } from '@/services/redis-client.service';

mockInstance(RedisClientService);
mockInstance(PubSubRegistry);
mockInstance(Subscriber);
mockInstance(WorkerStatusService);

test('should instantiate WorkerStatusService during orchestration setup', async () => {
	const containerGetSpy = jest.spyOn(Container, 'get');

	await new Worker().initOrchestration();

	expect(containerGetSpy).toHaveBeenCalledWith(WorkerStatusService);
});
