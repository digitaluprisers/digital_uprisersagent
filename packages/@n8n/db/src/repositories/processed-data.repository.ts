import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { ProcessedData } from '../entities';

@Service()
export class ProcessedDataRepository extends Repository<ProcessedData> {
	constructor(dataSource: DataSource) {
		super(ProcessedData, dataSource.manager);
	}
}
