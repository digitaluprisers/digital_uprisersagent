import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { AnnotationTagEntity } from '../entities';

@Service()
export class AnnotationTagRepository extends Repository<AnnotationTagEntity> {
	constructor(dataSource: DataSource) {
		super(AnnotationTagEntity, dataSource.manager);
	}
}
