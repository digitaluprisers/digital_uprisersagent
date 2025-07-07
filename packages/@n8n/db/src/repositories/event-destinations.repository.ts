import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { EventDestinations } from '../entities';

@Service()
export class EventDestinationsRepository extends Repository<EventDestinations> {
	constructor(dataSource: DataSource) {
		super(EventDestinations, dataSource.manager);
	}
}
