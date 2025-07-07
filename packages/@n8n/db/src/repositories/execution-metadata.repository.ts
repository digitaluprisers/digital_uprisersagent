import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { ExecutionMetadata } from '../entities';

@Service()
export class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {
	constructor(dataSource: DataSource) {
		super(ExecutionMetadata, dataSource.manager);
	}
}
