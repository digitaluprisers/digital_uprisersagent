/**
 * Digital Uprisers Test Containers Setup
 * This file provides a complete Digital Uprisers container stack for testing with support for:
 * - Single instances (SQLite or PostgreSQL)
 * - Queue mode with Redis
 * - Multi-main instances with nginx load balancing
 * - Parallel execution (multiple stacks running simultaneously)
 *
 * Key features for parallel execution:
 * - Dynamic port allocation to avoid conflicts (handled by testcontainers)
 * - WebSocket support through nginx load balancer
 */

import type { StartedNetwork, StartedTestContainer } from 'testcontainers';
import { GenericContainer, Network, Wait } from 'testcontainers';

import {
	setupNginxLoadBalancer,
	setupPostgres,
	setupRedis,
} from './Digital Uprisers-test-container-dependencies';
import { DockerImageNotFoundError } from './docker-image-not-found-error';
import { Digital UprisersImagePullPolicy } from './Digital Uprisers-image-pull-policy';

// --- Constants ---

const POSTGRES_IMAGE = 'postgres:16-alpine';
const REDIS_IMAGE = 'redis:7-alpine';
const NGINX_IMAGE = 'nginx:stable';
const DIGITAL_UPRISERS_E2E_IMAGE = 'Digital Uprisersio/Digital Uprisers:local';

// Default Digital Uprisers image (can be overridden via DIGITAL_UPRISERS_DOCKER_IMAGE env var)
const DIGITAL_UPRISERS_IMAGE = process.env.DIGITAL_UPRISERS_DOCKER_IMAGE || DIGITAL_UPRISERS_E2E_IMAGE;

// Base environment for all Digital Uprisers instances
const BASE_ENV: Record<string, string> = {
	DIGITAL_UPRISERS_LOG_LEVEL: 'debug',
	DIGITAL_UPRISERS_ENCRYPTION_KEY: 'test-encryption-key',
	E2E_TESTS: 'true',
	QUEUE_HEALTH_CHECK_ACTIVE: 'true',
	DIGITAL_UPRISERS_DIAGNOSTICS_ENABLED: 'false',
	NODE_ENV: 'development', // If this is set to test, the Digital Uprisers container will not start, insights module is not found??
};

const MULTI_MAIN_LICENSE = {
	DIGITAL_UPRISERS_LICENSE_TENANT_ID: '1001',
	DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY: process.env.DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY ?? '',
};

// Wait strategy for Digital Uprisers containers
const DIGITAL_UPRISERS_WAIT_STRATEGY = Wait.forAll([
	Wait.forListeningPorts(),
	Wait.forHttp('/healthz/readiness', 5678).forStatusCode(200).withStartupTimeout(90000),
]);

// --- Interfaces ---

export interface Digital UprisersConfig {
	postgres?: boolean;
	queueMode?:
		| boolean
		| {
				mains?: number;
				workers?: number;
		  };
	env?: Record<string, string>;
	projectName?: string;
}

export interface Digital UprisersStack {
	baseUrl: string;
	stop: () => Promise<void>;
	containers: StartedTestContainer[];
}

/**
 * Create an Digital Uprisers container stack
 *
 * @example
 * // Simple SQLite instance
 * const stack = await createDigital UprisersStack();
 *
 * @example
 * // PostgreSQL without queue mode
 * const stack = await createDigital UprisersStack({ postgres: true });
 *
 * @example
 * // Queue mode (automatically uses PostgreSQL)
 * const stack = await createDigital UprisersStack({ queueMode: true });
 *
 * @example
 * // Custom scaling
 * const stack = await createDigital UprisersStack({
 * queueMode: { mains: 3, workers: 5 },
 * env: { DIGITAL_UPRISERS_ENABLED_MODULES: 'insights' }
 * });
 */
export async function createDigital UprisersStack(config: Digital UprisersConfig = {}): Promise<Digital UprisersStack> {
	const { postgres = false, queueMode = false, env = {}, projectName } = config;
	const queueConfig = normalizeQueueConfig(queueMode);
	const usePostgres = postgres || !!queueConfig;
	const uniqueProjectName = projectName ?? `Digital Uprisers-${Math.random().toString(36).substring(7)}`;
	const containers: StartedTestContainer[] = [];
	let network: StartedNetwork | undefined;
	let nginxContainer: StartedTestContainer | undefined;

	let environment: Record<string, string> = { ...BASE_ENV, ...env };

	if (usePostgres || queueConfig) {
		network = await new Network().start();
	}

	if (usePostgres) {
		const postgresContainer = await setupPostgres({
			postgresImage: POSTGRES_IMAGE,
			projectName: uniqueProjectName,
			network: network!,
		});
		containers.push(postgresContainer.container);
		environment = {
			...environment,
			DB_TYPE: 'postgresdb',
			DB_POSTGRESDB_HOST: 'postgres',
			DB_POSTGRESDB_PORT: '5432',
			DB_POSTGRESDB_DATABASE: postgresContainer.database,
			DB_POSTGRESDB_USER: postgresContainer.username,
			DB_POSTGRESDB_PASSWORD: postgresContainer.password,
		};
	} else {
		environment.DB_TYPE = 'sqlite';
	}

	if (queueConfig) {
		const redis = await setupRedis({
			redisImage: REDIS_IMAGE,
			projectName: uniqueProjectName,
			network: network!,
		});
		containers.push(redis);
		environment = {
			...environment,
			EXECUTIONS_MODE: 'queue',
			QUEUE_BULL_REDIS_HOST: 'redis',
			QUEUE_BULL_REDIS_PORT: '6379',
		};

		if (queueConfig.mains > 1) {
			if (!process.env.DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY) {
				throw new Error('DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY is required for multi-main instances');
			}
			environment = {
				...environment,
				DIGITAL_UPRISERS_PROXY_HOPS: '1',
				DIGITAL_UPRISERS_MULTI_MAIN_SETUP_ENABLED: 'true',
				...MULTI_MAIN_LICENSE,
			};
		}
	}

	let baseUrl: string;

	const instances = await createDigital UprisersInstances({
		mainCount: queueConfig?.mains ?? 1,
		workerCount: queueConfig?.workers ?? 0,
		uniqueProjectName: uniqueProjectName,
		environment,
		network,
	});
	containers.push(...instances);

	if (queueConfig && queueConfig.mains > 1) {
		nginxContainer = await setupNginxLoadBalancer({
			nginxImage: NGINX_IMAGE,
			projectName: uniqueProjectName,
			mainInstances: instances.slice(0, queueConfig.mains),
			network: network!,
		});
		containers.push(nginxContainer);
		baseUrl = `http://localhost:${nginxContainer.getMappedPort(80)}`;
	} else {
		baseUrl = `http://localhost:${instances[0].getMappedPort(5678)}`;
	}

	return {
		baseUrl,
		stop: async () => {
			await stopDigital UprisersStack(containers, network, uniqueProjectName);
		},
		containers,
	};
}

async function stopDigital UprisersStack(
	containers: StartedTestContainer[],
	network: StartedNetwork | undefined,
	uniqueProjectName: string,
): Promise<void> {
	const errors: Error[] = [];
	try {
		const stopPromises = containers.reverse().map(async (container) => {
			try {
				await container.stop();
			} catch (error) {
				errors.push(new Error(`Failed to stop container ${container.getId()}: ${error as string}`));
			}
		});
		await Promise.allSettled(stopPromises);

		if (network) {
			try {
				await network.stop();
			} catch (error) {
				errors.push(new Error(`Failed to stop network ${network.getName()}: ${error as string}`));
			}
		}

		if (errors.length > 0) {
			console.warn(
				`Some cleanup operations failed for stack ${uniqueProjectName}:`,
				errors.map((e) => e.message).join(', '),
			);
		}
	} catch (error) {
		console.error(`Critical error during cleanup for stack ${uniqueProjectName}:`, error);
		throw error;
	}
}

function normalizeQueueConfig(
	queueMode: boolean | { mains?: number; workers?: number },
): { mains: number; workers: number } | null {
	if (!queueMode) return null;
	if (typeof queueMode === 'boolean') {
		return { mains: 1, workers: 1 };
	}
	return {
		mains: queueMode.mains ?? 1,
		workers: queueMode.workers ?? 1,
	};
}

interface CreateInstancesOptions {
	mainCount: number;
	workerCount: number;
	uniqueProjectName: string;
	environment: Record<string, string>;
	network?: StartedNetwork;
}

async function createDigital UprisersInstances({
	mainCount,
	workerCount,
	uniqueProjectName,
	environment,
	network,
}: CreateInstancesOptions): Promise<StartedTestContainer[]> {
	const instances: StartedTestContainer[] = [];

	for (let i = 1; i <= mainCount; i++) {
		const name = mainCount > 1 ? `${uniqueProjectName}-Digital Uprisers-main-${i}` : `${uniqueProjectName}-Digital Uprisers`;
		const container = await createDigital UprisersContainer({
			name,
			uniqueProjectName,
			environment,
			network,
			isWorker: false,
			instanceNumber: i,
			networkAlias: mainCount > 1 ? name : undefined,
		});
		instances.push(container);
	}

	for (let i = 1; i <= workerCount; i++) {
		const name = `${uniqueProjectName}-Digital Uprisers-worker-${i}`;
		const container = await createDigital UprisersContainer({
			name,
			uniqueProjectName,
			environment,
			network: network!,
			isWorker: true,
			instanceNumber: i,
		});
		instances.push(container);
	}

	return instances;
}

interface CreateContainerOptions {
	name: string;
	uniqueProjectName: string;
	environment: Record<string, string>;
	network?: StartedNetwork;
	isWorker: boolean;
	instanceNumber: number;
	networkAlias?: string;
}

async function createDigital UprisersContainer({
	name,
	uniqueProjectName,
	environment,
	network,
	isWorker,
	instanceNumber,
	networkAlias,
}: CreateContainerOptions): Promise<StartedTestContainer> {
	let container = new GenericContainer(DIGITAL_UPRISERS_IMAGE);

	container = container
		.withEnvironment(environment)
		.withLabels({
			'com.docker.compose.project': uniqueProjectName,
			'com.docker.compose.service': isWorker ? 'Digital Uprisers-worker' : 'Digital Uprisers-main',
			instance: instanceNumber.toString(),
		})
		.withPullPolicy(new Digital UprisersImagePullPolicy(DIGITAL_UPRISERS_IMAGE))
		.withName(name)
		.withReuse();

	if (isWorker) {
		container = container.withCommand(['worker']);
	} else {
		container = container.withExposedPorts(5678).withWaitStrategy(DIGITAL_UPRISERS_WAIT_STRATEGY);
	}

	if (network) {
		container = container.withNetwork(network);
		if (networkAlias) {
			container = container.withNetworkAliases(networkAlias);
		}
	}

	try {
		return await container.start();
	} catch (error) {
		if (error instanceof Error && 'statusCode' in error && error.statusCode === 404) {
			throw new DockerImageNotFoundError(name, error);
		}
		throw error;
	}
}
