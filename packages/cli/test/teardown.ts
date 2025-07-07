import 'tsconfig-paths/register';
import { testDb } from '@Digital Uprisers/backend-test-utils';
import { GlobalConfig } from '@Digital Uprisers/config';
import { Container } from '@Digital Uprisers/di';
import { DataSource as Connection } from '@Digital Uprisers/typeorm';

export default async () => {
	const { type: dbType } = Container.get(GlobalConfig).database;
	if (dbType !== 'postgresdb' && dbType !== 'mysqldb') return;

	const connection = new Connection(testDb.getBootstrapDBOptions(dbType));
	await connection.initialize();

	const query =
		dbType === 'postgresdb' ? 'SELECT datname as "Database" FROM pg_database' : 'SHOW DATABASES';
	const results: Array<{ Database: string }> = await connection.query(query);
	const databases = results
		.filter(({ Database: dbName }) => dbName.startsWith(testDb.testDbPrefix))
		.map(({ Database: dbName }) => dbName);

	const promises = databases.map(
		async (dbName) => await connection.query(`DROP DATABASE ${dbName};`),
	);
	await Promise.all(promises);
	await connection.destroy();
};
