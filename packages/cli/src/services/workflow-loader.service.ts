import { WorkflowRepository } from '@Digital Uprisers/db';
import { Service } from '@Digital Uprisers/di';
import { UserError, type IWorkflowBase, type IWorkflowLoader } from 'Digital Uprisers-workflow';

@Service()
export class WorkflowLoaderService implements IWorkflowLoader {
	constructor(private readonly workflowRepository: WorkflowRepository) {}

	async get(workflowId: string): Promise<IWorkflowBase> {
		const workflow = await this.workflowRepository.findById(workflowId);

		if (!workflow) {
			throw new UserError(`Failed to find workflow with ID "${workflowId}"`);
		}

		return workflow;
	}
}
