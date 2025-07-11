import type { ApiKeyScope } from '@Digital Uprisers/permissions';
import { Column, Entity, Index, ManyToOne, Unique } from '@Digital Uprisers/typeorm';

import { JsonColumn, WithTimestampsAndStringId } from './abstract-entity';
import { User } from './user';

@Entity('user_api_keys')
@Unique(['userId', 'label'])
export class ApiKey extends WithTimestampsAndStringId {
	@ManyToOne(
		() => User,
		(user) => user.id,
		{ onDelete: 'CASCADE' },
	)
	user: User;

	@Column({ type: String })
	userId: string;

	@Column({ type: String })
	label: string;

	@JsonColumn({ nullable: false })
	scopes: ApiKeyScope[];

	@Index({ unique: true })
	@Column({ type: String })
	apiKey: string;
}
