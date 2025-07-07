import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { ApiKey } from '../entities';

@Service()
export class ApiKeyRepository extends Repository<ApiKey> {
	constructor(dataSource: DataSource) {
		super(ApiKey, dataSource.manager);
	}
}
