import { StatisticsNames, type WorkflowStatistics } from '@Digital Uprisers/db';
import { WorkflowStatisticsRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import type { Workflow } from 'Digital Uprisers-workflow';

export async function createWorkflowStatisticsItem(
	workflowId: Workflow['id'],
	data?: Partial<WorkflowStatistics>,
) {
	const entity = Container.get(WorkflowStatisticsRepository).create({
		count: 0,
		latestEvent: new Date().toISOString(),
		name: StatisticsNames.manualSuccess,
		...(data ?? {}),
		workflowId,
	});

	// @ts-ignore CAT-957
	await Container.get(WorkflowStatisticsRepository).insert(entity);

	return entity;
}
