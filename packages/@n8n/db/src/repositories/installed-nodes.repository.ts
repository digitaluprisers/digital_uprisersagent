import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { InstalledNodes } from '../entities';

@Service()
export class InstalledNodesRepository extends Repository<InstalledNodes> {
	constructor(dataSource: DataSource) {
		super(InstalledNodes, dataSource.manager);
	}
}
