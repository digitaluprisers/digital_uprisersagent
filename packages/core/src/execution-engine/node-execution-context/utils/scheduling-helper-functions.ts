import { Container } from '@Digital Uprisers/di';
import type { SchedulingFunctions, Workflow } from 'Digital Uprisers-workflow';

import { ScheduledTaskManager } from '../../scheduled-task-manager';

export const getSchedulingFunctions = (workflow: Workflow): SchedulingFunctions => {
	const scheduledTaskManager = Container.get(ScheduledTaskManager);
	return {
		registerCron: (cronExpression, onTick) =>
			scheduledTaskManager.registerCron(workflow, cronExpression, onTick),
	};
};
