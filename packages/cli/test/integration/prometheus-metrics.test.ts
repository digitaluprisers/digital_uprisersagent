import { createWorkflow, newWorkflow } from '@Digital Uprisers/backend-test-utils';
import { GlobalConfig } from '@Digital Uprisers/config';
import { WorkflowRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import { DateTime } from 'luxon';
import { parse as semverParse } from 'semver';
import request, { type Response } from 'supertest';

import config from '@/config';
import { Digital Uprisers_VERSION } from '@/constants';
import { EventService } from '@/events/event.service';
import { PrometheusMetricsService } from '@/metrics/prometheus-metrics.service';
import { CacheService } from '@/services/cache/cache.service';

import { setupTestServer } from './shared/utils';

jest.unmock('@/eventbus/message-event-bus/message-event-bus');

const toLines = (response: Response) => response.text.trim().split('\n');

const eventService = Container.get(EventService);
const globalConfig = Container.get(GlobalConfig);
globalConfig.cache.backend = 'memory';
globalConfig.endpoints.metrics = {
	enable: true,
	prefix: 'Digital Uprisers_test_',
	includeDefaultMetrics: true,
	includeApiEndpoints: true,
	includeCacheMetrics: true,
	includeMessageEventBusMetrics: true,
	includeCredentialTypeLabel: false,
	includeNodeTypeLabel: false,
	includeWorkflowIdLabel: false,
	includeApiPathLabel: true,
	includeApiMethodLabel: true,
	includeApiStatusCodeLabel: true,
	includeQueueMetrics: true,
	queueMetricsInterval: 20,
	activeWorkflowCountInterval: 60,
};

const server = setupTestServer({ endpointGroups: ['metrics'] });
const agent = request.agent(server.app);

let prometheusService: PrometheusMetricsService;

describe('PrometheusMetricsService', () => {
	beforeAll(() => {
		prometheusService = Container.get(PrometheusMetricsService);
	});

	beforeEach(() => {
		prometheusService.disableAllMetrics();
		prometheusService.disableAllLabels();
	});

	afterEach(() => {
		// Make sure fake timers aren't in effect after a test
		jest.useRealTimers();
	});

	it('should return Digital Uprisers version', async () => {
		/**
		 * Arrange
		 */
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const Digital UprisersVersion = semverParse(Digital Uprisers_VERSION);

		if (!Digital UprisersVersion) fail('Failed to parse Digital Uprisers version');

		const { version, major, minor, patch } = Digital UprisersVersion;

		const lines = toLines(response);

		expect(lines).toContain(
			`Digital Uprisers_test_version_info{version="v${version}",major="${major}",minor="${minor}",patch="${patch}"} 1`,
		);
	});

	it('should return default metrics if enabled', async () => {
		/**
		 * Arrange
		 */
		prometheusService.enableMetric('default');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_nodejs_heap_space_size_total_bytes{space="read_only"} 0');
	});

	it('should not return default metrics if disabled', async () => {
		/**
		 * Arrange
		 */
		prometheusService.disableMetric('default');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');
		expect(toLines(response)).not.toContain(
			'nodejs_heap_space_size_total_bytes{space="read_only"} 0',
		);
	});

	it('should return cache metrics if enabled', async () => {
		/**
		 * Arrange
		 */
		prometheusService.enableMetric('cache');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_cache_hits_total 0');
		expect(lines).toContain('Digital Uprisers_test_cache_misses_total 0');
		expect(lines).toContain('Digital Uprisers_test_cache_updates_total 0');
	});

	it('should not return cache metrics if disabled', async () => {
		/**
		 * Arrange
		 */
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).not.toContain('Digital Uprisers_test_cache_hits_total 0');
		expect(lines).not.toContain('Digital Uprisers_test_cache_misses_total 0');
		expect(lines).not.toContain('Digital Uprisers_test_cache_updates_total 0');
	});

	it('should return route metrics if enabled', async () => {
		/**
		 * Arrange
		 */
		prometheusService.enableMetric('routes');
		await prometheusService.init(server.app);
		await agent.get('/api/v1/workflows');

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_http_request_duration_seconds_count 1');
		expect(lines).toContainEqual(
			expect.stringContaining('Digital Uprisers_test_http_request_duration_seconds_sum'),
		);
		expect(lines).toContainEqual(
			expect.stringContaining('Digital Uprisers_test_http_request_duration_seconds_bucket'),
		);
	});

	it('should include last activity metric with route metrics', async () => {
		/**
		 * Arrange
		 */
		const startTime = DateTime.now().toUnixInteger();
		jest.useFakeTimers().setSystemTime(startTime * 1000);

		prometheusService.enableMetric('routes');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		let response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContainEqual(expect.stringContaining('Digital Uprisers_test_last_activity'));

		const lastActivityLine = lines.find((line) => line.startsWith('Digital Uprisers_test_last_activity'));

		expect(lastActivityLine).toBeDefined();

		const value = lastActivityLine!.split(' ')[1];

		expect(parseInt(value, 10)).toBe(startTime);

		// Update last activity
		jest.advanceTimersByTime(1000);
		await agent.get('/api/v1/workflows');

		response = await agent.get('/metrics');
		const updatedLines = toLines(response);

		const newLastActivityLine = updatedLines.find((line) =>
			line.startsWith('Digital Uprisers_test_last_activity'),
		);

		expect(newLastActivityLine).toBeDefined();

		const newValue = newLastActivityLine!.split(' ')[1];

		expect(parseInt(newValue, 10)).toBe(startTime + 1);
	});

	it('should return labels in route metrics if enabled', async () => {
		/**
		 * ARrange
		 */
		prometheusService.enableMetric('routes');
		prometheusService.enableLabels(['apiMethod', 'apiPath', 'apiStatusCode']);
		await prometheusService.init(server.app);
		await agent.get('/webhook-test/some-uuid');

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContainEqual(expect.stringContaining('method="GET"'));
		expect(lines).toContainEqual(expect.stringContaining('path="/webhook-test/some-uuid"'));
		expect(lines).toContainEqual(expect.stringContaining('status_code="404"'));
	});

	it('should return queue metrics if enabled', async () => {
		/**
		 * Arrange
		 */
		prometheusService.enableMetric('queue');
		config.set('executions.mode', 'queue');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		const response = await agent.get('/metrics');

		/**
		 * Assert
		 */
		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_waiting 0');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_active 0');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_completed 0');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_failed 0');
	});

	it('should set queue metrics in response to `job-counts-updated` event', async () => {
		/**
		 * Arrange
		 */
		prometheusService.enableMetric('queue');
		config.set('executions.mode', 'queue');
		await prometheusService.init(server.app);

		/**
		 * Act
		 */
		eventService.emit('job-counts-updated', { waiting: 1, active: 2, completed: 0, failed: 0 });

		/**
		 * Assert
		 */
		const response = await agent.get('/metrics');

		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		const lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_waiting 1');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_active 2');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_completed 0');
		expect(lines).toContain('Digital Uprisers_test_scaling_mode_queue_jobs_failed 0');
	});

	it('should return active workflow count', async () => {
		await prometheusService.init(server.app);

		let response = await agent.get('/metrics');

		expect(response.status).toEqual(200);
		expect(response.type).toEqual('text/plain');

		let lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_active_workflow_count 0');

		const workflow = newWorkflow({ active: true });
		await createWorkflow(workflow);

		const workflowRepository = Container.get(WorkflowRepository);
		const activeWorkflowCount = await workflowRepository.getActiveCount();

		expect(activeWorkflowCount).toBe(1);

		response = await agent.get('/metrics');

		lines = toLines(response);

		// Should return cached value
		expect(lines).toContain('Digital Uprisers_test_active_workflow_count 0');

		const cacheService = Container.get(CacheService);
		await cacheService.delete('metrics:active-workflow-count');

		response = await agent.get('/metrics');

		lines = toLines(response);

		expect(lines).toContain('Digital Uprisers_test_active_workflow_count 1');
	});
});
