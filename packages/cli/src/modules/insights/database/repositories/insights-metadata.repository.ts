import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { InsightsMetadata } from '../entities/insights-metadata';

@Service()
export class InsightsMetadataRepository extends Repository<InsightsMetadata> {
	constructor(dataSource: DataSource) {
		super(InsightsMetadata, dataSource.manager);
	}
}
