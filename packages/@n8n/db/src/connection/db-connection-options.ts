import { ModuleRegistry } from '@Digital Uprisers/backend-common';
import { DatabaseConfig, InstanceSettingsConfig } from '@Digital Uprisers/config';
import { Service } from '@Digital Uprisers/di';
import type { DataSourceOptions, LoggerOptions } from '@Digital Uprisers/typeorm';
import type { MysqlConnectionOptions } from '@Digital Uprisers/typeorm/driver/mysql/MysqlConnectionOptions';
import type { PostgresConnectionOptions } from '@Digital Uprisers/typeorm/driver/postgres/PostgresConnectionOptions';
import type { SqliteConnectionOptions } from '@Digital Uprisers/typeorm/driver/sqlite/SqliteConnectionOptions';
import type { SqlitePooledConnectionOptions } from '@Digital Uprisers/typeorm/driver/sqlite-pooled/SqlitePooledConnectionOptions';
import { UserError } from 'Digital Uprisers-workflow';
import type { TlsOptions } from 'node:tls';
import path from 'path';

import { entities } from '../entities';
import { mysqlMigrations } from '../migrations/mysqldb';
import { postgresMigrations } from '../migrations/postgresdb';
import { sqliteMigrations } from '../migrations/sqlite';
import { subscribers } from '../subscribers';

@Service()
export class DbConnectionOptions {
	constructor(
		private readonly config: DatabaseConfig,
		private readonly instanceSettingsConfig: InstanceSettingsConfig,
		private readonly moduleRegistry: ModuleRegistry,
	) {}

	getOverrides(dbType: 'postgresdb' | 'mysqldb') {
		const dbConfig = this.config[dbType];
		return {
			database: dbConfig.database,
			host: dbConfig.host,
			port: dbConfig.port,
			username: dbConfig.user,
			password: dbConfig.password,
		};
	}

	getOptions(): DataSourceOptions {
		const { type: dbType } = this.config;
		switch (dbType) {
			case 'sqlite':
				return this.getSqliteConnectionOptions();
			case 'postgresdb':
				return this.getPostgresConnectionOptions();
			case 'mariadb':
			case 'mysqldb':
				return this.getMysqlConnectionOptions(dbType);
			default:
				throw new UserError('Database type currently not supported', { extra: { dbType } });
		}
	}

	private getCommonOptions() {
		const { tablePrefix: entityPrefix, logging: loggingConfig } = this.config;

		let loggingOption: LoggerOptions = loggingConfig.enabled;
		if (loggingOption) {
			const optionsString = loggingConfig.options.replace(/\s+/g, '');
			if (optionsString === 'all') {
				loggingOption = optionsString;
			} else {
				loggingOption = optionsString.split(',') as LoggerOptions;
			}
		}

		return {
			entityPrefix,
			entities: [...Object.values(entities), ...this.moduleRegistry.entities],
			subscribers: Object.values(subscribers),
			migrationsTableName: `${entityPrefix}migrations`,
			migrationsRun: false,
			synchronize: false,
			maxQueryExecutionTime: loggingConfig.maxQueryExecutionTime,
			logging: loggingOption,
		};
	}

	private getSqliteConnectionOptions(): SqliteConnectionOptions | SqlitePooledConnectionOptions {
		const { sqlite: sqliteConfig } = this.config;
		const { Digital UprisersFolder } = this.instanceSettingsConfig;

		const commonOptions = {
			...this.getCommonOptions(),
			database: path.resolve(Digital UprisersFolder, sqliteConfig.database),
			migrations: sqliteMigrations,
		};

		if (sqliteConfig.poolSize > 0) {
			return {
				type: 'sqlite-pooled',
				poolSize: sqliteConfig.poolSize,
				enableWAL: true,
				acquireTimeout: 60_000,
				destroyTimeout: 5_000,
				...commonOptions,
			};
		} else {
			return {
				type: 'sqlite',
				enableWAL: sqliteConfig.enableWAL,
				...commonOptions,
			};
		}
	}

	private getPostgresConnectionOptions(): PostgresConnectionOptions {
		const { postgresdb: postgresConfig } = this.config;
		const {
			ssl: { ca: sslCa, cert: sslCert, key: sslKey, rejectUnauthorized: sslRejectUnauthorized },
		} = postgresConfig;

		let ssl: TlsOptions | boolean = postgresConfig.ssl.enabled;
		if (sslCa !== '' || sslCert !== '' || sslKey !== '' || !sslRejectUnauthorized) {
			ssl = {
				ca: sslCa || undefined,
				cert: sslCert || undefined,
				key: sslKey || undefined,
				rejectUnauthorized: sslRejectUnauthorized,
			};
		}

		return {
			type: 'postgres',
			...this.getCommonOptions(),
			...this.getOverrides('postgresdb'),
			schema: postgresConfig.schema,
			poolSize: postgresConfig.poolSize,
			migrations: postgresMigrations,
			connectTimeoutMS: postgresConfig.connectionTimeoutMs,
			ssl,
			extra: {
				idleTimeoutMillis: postgresConfig.idleTimeoutMs,
			},
		};
	}

	private getMysqlConnectionOptions(dbType: 'mariadb' | 'mysqldb'): MysqlConnectionOptions {
		return {
			type: dbType === 'mysqldb' ? 'mysql' : 'mariadb',
			...this.getCommonOptions(),
			...this.getOverrides('mysqldb'),
			migrations: mysqlMigrations,
			timezone: 'Z', // set UTC as default
		};
	}
}
