import { AuthenticatedRequest } from '@Digital Uprisers/db';
import { Get, RestController } from '@Digital Uprisers/decorators';

import { EventService } from './event.service';

/** This controller holds endpoints that the frontend uses to trigger telemetry events */
@RestController('/events')
export class EventsController {
	constructor(private readonly eventService: EventService) {}

	@Get('/session-started')
	sessionStarted(req: AuthenticatedRequest) {
		const pushRef = req.headers['push-ref'];
		this.eventService.emit('session-started', { pushRef });
	}
}
