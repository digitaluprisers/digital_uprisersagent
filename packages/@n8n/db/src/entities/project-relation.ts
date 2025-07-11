import { ProjectRole } from '@Digital Uprisers/permissions';
import { Column, Entity, ManyToOne, PrimaryColumn } from '@Digital Uprisers/typeorm';

import { WithTimestamps } from './abstract-entity';
import { Project } from './project';
import { User } from './user';

@Entity()
export class ProjectRelation extends WithTimestamps {
	@Column({ type: 'varchar' })
	role: ProjectRole;

	@ManyToOne('User', 'projectRelations')
	user: User;

	@PrimaryColumn('uuid')
	userId: string;

	@ManyToOne('Project', 'projectRelations')
	project: Project;

	@PrimaryColumn()
	projectId: string;
}
