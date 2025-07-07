import { Entity, PrimaryColumn } from '@Digital Uprisers/typeorm';
import { MessageEventBusDestinationOptions } from 'Digital Uprisers-workflow';

import { JsonColumn, WithTimestamps } from './abstract-entity';

@Entity({ name: 'event_destinations' })
export class EventDestinations extends WithTimestamps {
	@PrimaryColumn('uuid')
	id: string;

	@JsonColumn()
	destination: MessageEventBusDestinationOptions;
}
