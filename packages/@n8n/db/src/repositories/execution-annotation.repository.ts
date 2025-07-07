import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { ExecutionAnnotation } from '../entities';

@Service()
export class ExecutionAnnotationRepository extends Repository<ExecutionAnnotation> {
	constructor(dataSource: DataSource) {
		super(ExecutionAnnotation, dataSource.manager);
	}
}
