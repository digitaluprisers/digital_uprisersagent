import { Service } from '@Digital Uprisers/di';
import { DataSource, LessThan, Repository } from '@Digital Uprisers/typeorm';

import { WorkflowHistory } from '../entities';

@Service()
export class WorkflowHistoryRepository extends Repository<WorkflowHistory> {
	constructor(dataSource: DataSource) {
		super(WorkflowHistory, dataSource.manager);
	}

	async deleteEarlierThan(date: Date) {
		return await this.delete({ createdAt: LessThan(date) });
	}
}
