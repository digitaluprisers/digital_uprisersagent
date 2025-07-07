import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { AuthProviderSyncHistory } from '../entities';

@Service()
export class AuthProviderSyncHistoryRepository extends Repository<AuthProviderSyncHistory> {
	constructor(dataSource: DataSource) {
		super(AuthProviderSyncHistory, dataSource.manager);
	}
}
