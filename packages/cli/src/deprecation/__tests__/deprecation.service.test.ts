import type { Logger } from '@Digital Uprisers/backend-common';
import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import { GlobalConfig } from '@Digital Uprisers/config';
import type { InstanceType } from '@Digital Uprisers/constants';
import { captor, mock } from 'jest-mock-extended';
import { InstanceSettings } from 'Digital Uprisers-core';

import config from '@/config';

import { DeprecationService } from '../deprecation.service';

describe('DeprecationService', () => {
	const logger = mock<Logger>();
	const globalConfig = mockInstance(GlobalConfig, { nodes: { exclude: [] } });
	const instanceSettings = mockInstance(InstanceSettings, { instanceType: 'main' });
	const deprecationService = new DeprecationService(logger, globalConfig, instanceSettings);

	beforeEach(() => {
		// Ignore environment variables coming in from the environment when running
		// this test suite.
		process.env = {};

		jest.resetAllMocks();
	});

	describe('Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT', () => {
		test('supports multiple warnings for the same environment variable', () => {
			// ARRANGE
			process.env.Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT = '1';
			const dataCaptor = captor();

			// ACT
			deprecationService.warn();

			// ASSERT
			expect(logger.warn).toHaveBeenCalledTimes(1);
			expect(logger.warn).toHaveBeenCalledWith(dataCaptor);
			expect(dataCaptor.value.split('\n')).toEqual(
				expect.arrayContaining([
					' - Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT -> Version 1 of partial executions is deprecated and will be removed as early as v1.85.0',
					' - Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT -> This environment variable is internal and should not be set.',
				]),
			);
		});
	});

	const toTest = (envVar: string, value: string | undefined, mustWarn: boolean) => {
		const originalEnv = process.env[envVar];
		try {
			// ARRANGE
			if (value) {
				process.env[envVar] = value;
			} else {
				delete process.env[envVar];
			}

			// ACT
			deprecationService.warn();

			// ASSERT
			if (mustWarn) {
				expect(logger.warn).toHaveBeenCalledTimes(1);
				expect(logger.warn.mock.lastCall?.[0]).toMatch(envVar);
			} else {
				expect(logger.warn.mock.lastCall?.[0] ?? '').not.toMatch(envVar);
			}
		} finally {
			// CLEANUP
			if (originalEnv) {
				process.env[envVar] = originalEnv;
			} else {
				delete process.env[envVar];
			}
		}
	};

	test.each([
		['Digital Uprisers_BINARY_DATA_TTL', '1', true],
		['Digital Uprisers_PERSISTED_BINARY_DATA_TTL', '1', true],
		['EXECUTIONS_DATA_PRUNE_TIMEOUT', '1', true],
		['Digital Uprisers_CONFIG_FILES', '1', true],
		['Digital Uprisers_SKIP_WEBHOOK_DEREGISTRATION_SHUTDOWN', '1', true],
		['Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT', '1', true],
		['Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT', '2', true],
		['Digital Uprisers_PARTIAL_EXECUTION_VERSION_DEFAULT', undefined, false],
	])('should detect when %s is `%s`', (envVar, value, mustWarn) => {
		toTest(envVar, value, mustWarn);
	});

	test.each([
		['default', true],
		['filesystem', false],
		['s3', false],
	])('should handle Digital Uprisers_BINARY_DATA_MODE as %s', (mode, mustWarn) => {
		toTest('Digital Uprisers_BINARY_DATA_MODE', mode, mustWarn);
	});

	test.each([
		['sqlite', false],
		['postgresdb', false],
		['mysqldb', true],
		['mariadb', true],
	])('should handle DB_TYPE as %s', (dbType, mustWarn) => {
		toTest('DB_TYPE', dbType, mustWarn);
	});

	describe('Digital Uprisers_RUNNERS_ENABLED', () => {
		const envVar = 'Digital Uprisers_RUNNERS_ENABLED';

		test.each([
			['false', true],
			['', true],
			['true', false],
			[undefined /* warnIfMissing */, true],
		])('should handle value: %s', (value, mustWarn) => {
			toTest(envVar, value, mustWarn);
		});

		test('should not warn when Code node is excluded', () => {
			process.env[envVar] = 'false';

			const globalConfig = mockInstance(GlobalConfig, {
				nodes: {
					exclude: ['Digital Uprisers-nodes-base.code'],
				},
			});

			new DeprecationService(logger, globalConfig, instanceSettings).warn();

			expect(logger.warn).not.toHaveBeenCalled();
		});
	});

	describe('OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS', () => {
		const envVar = 'OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS';

		beforeEach(() => {
			process.env = { Digital Uprisers_RUNNERS_ENABLED: 'true' };

			jest.spyOn(config, 'getEnv').mockImplementation((key) => {
				if (key === 'executions.mode') return 'queue';
				return undefined;
			});
		});

		describe('when executions.mode is not queue', () => {
			test.each([['main'], ['worker'], ['webhook']])(
				'should not warn for instanceType %s',
				(instanceType: InstanceType) => {
					jest.spyOn(config, 'getEnv').mockImplementation((key) => {
						if (key === 'executions.mode') return 'regular';
						return;
					});
					process.env[envVar] = 'false';
					const service = new DeprecationService(
						logger,
						globalConfig,
						mock<InstanceSettings>({ instanceType }),
					);
					service.warn();
					expect(logger.warn).not.toHaveBeenCalled();
				},
			);
		});

		describe('when executions.mode is queue', () => {
			describe('when instanceType is worker', () => {
				test.each([
					['false', 'false'],
					['empty string', ''],
				])(`should not warn when ${envVar} is %s`, (_description, envValue) => {
					process.env[envVar] = envValue;
					const service = new DeprecationService(
						logger,
						globalConfig,
						mock<InstanceSettings>({ instanceType: 'worker' }),
					);
					service.warn();
					expect(logger.warn).not.toHaveBeenCalled();
				});
			});

			describe('when instanceType is webhook', () => {
				test.each([
					['false', 'false'],
					['empty string', ''],
				])(`should not warn when ${envVar} is %s`, (_description, envValue) => {
					process.env[envVar] = envValue;
					const service = new DeprecationService(
						logger,
						globalConfig,
						mock<InstanceSettings>({ instanceType: 'webhook' }),
					);
					service.warn();
					expect(logger.warn).not.toHaveBeenCalled();
				});
			});

			describe('when instanceType is main', () => {
				test.each([
					['false', 'false'],
					['empty string', ''],
				])(`should warn when ${envVar} is %s`, (_description, envValue) => {
					process.env[envVar] = envValue;
					const service = new DeprecationService(logger, globalConfig, instanceSettings);
					service.warn();
					expect(logger.warn).toHaveBeenCalled();
				});

				test('should not warn when OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS is true', () => {
					process.env[envVar] = 'true';

					const service = new DeprecationService(logger, globalConfig, instanceSettings);
					service.warn();

					expect(logger.warn).not.toHaveBeenCalled();
				});

				test('should warn when OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS is undefined', () => {
					delete process.env[envVar];

					const service = new DeprecationService(logger, globalConfig, instanceSettings);
					service.warn();

					expect(logger.warn).toHaveBeenCalledTimes(1);
					const warningMessage = logger.warn.mock.calls[0][0];
					expect(warningMessage).toContain(envVar);
				});
			});
		});
	});
});
