import { TestRunRepository, TestCaseExecutionRepository } from '@Digital Uprisers/db';
import type { TestRun } from '@Digital Uprisers/db';
import type { TestCaseExecution } from '@Digital Uprisers/db';
import type { AggregatedTestRunMetrics } from '@Digital Uprisers/db';
import type { TestCaseExecutionErrorCode, TestRunErrorCode } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import type { IDataObject } from 'Digital Uprisers-workflow';

/**
 * Creates a test run for a workflow
 */
export const createTestRun = async (
	workflowId: string,
	options: {
		status?: TestRun['status'];
		runAt?: Date | null;
		completedAt?: Date | null;
		metrics?: AggregatedTestRunMetrics;
		errorCode?: TestRunErrorCode;
		errorDetails?: IDataObject;
	} = {},
) => {
	const testRunRepository = Container.get(TestRunRepository);

	const testRun = testRunRepository.create({
		workflow: { id: workflowId },
		status: options.status ?? 'new',
		runAt: options.runAt ?? null,
		completedAt: options.completedAt ?? null,
		metrics: options.metrics ?? {},
		errorCode: options.errorCode,
		errorDetails: options.errorDetails,
	});

	return await testRunRepository.save(testRun);
};

/**
 * Creates a test case execution for a test run
 */
export const createTestCaseExecution = async (
	testRunId: string,
	options: {
		status?: TestCaseExecution['status'];
		runAt?: Date | null;
		completedAt?: Date | null;
		metrics?: Record<string, number>;
		errorCode?: TestCaseExecutionErrorCode;
		errorDetails?: IDataObject;
		executionId?: string;
		pastExecutionId?: string;
	} = {},
) => {
	const testCaseExecutionRepository = Container.get(TestCaseExecutionRepository);

	const testCaseExecution = testCaseExecutionRepository.create({
		testRun: { id: testRunId },
		status: options.status ?? 'success',
		runAt: options.runAt ?? null,
		completedAt: options.completedAt ?? null,
		metrics: options.metrics ?? {},
		errorCode: options.errorCode,
		errorDetails: options.errorDetails,
		executionId: options.executionId,
	});

	return await testCaseExecutionRepository.save(testCaseExecution);
};
