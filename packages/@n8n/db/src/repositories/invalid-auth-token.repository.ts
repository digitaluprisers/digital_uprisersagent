import { Service } from '@Digital Uprisers/di';
import { DataSource, Repository } from '@Digital Uprisers/typeorm';

import { InvalidAuthToken } from '../entities';

@Service()
export class InvalidAuthTokenRepository extends Repository<InvalidAuthToken> {
	constructor(dataSource: DataSource) {
		super(InvalidAuthToken, dataSource.manager);
	}
}
