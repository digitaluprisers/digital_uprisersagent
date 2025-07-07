import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { Variables } from '../entities';

@Service()
export class VariablesRepository extends Repository<Variables> {
	constructor(dataSource: DataSource) {
		super(Variables, dataSource.manager);
	}
}
