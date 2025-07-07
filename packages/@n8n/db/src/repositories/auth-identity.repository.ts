import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { AuthIdentity } from '../entities';

@Service()
export class AuthIdentityRepository extends Repository<AuthIdentity> {
	constructor(dataSource: DataSource) {
		super(AuthIdentity, dataSource.manager);
	}
}
