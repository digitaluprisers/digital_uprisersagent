import type { AuthenticatedDigital UprisersApiClient } from '@/Digital Uprisers-api-client/authenticated-Digital Uprisers-api-client';
import type { Workflow } from '@/Digital Uprisers-api-client/Digital Uprisers-api-client.types';
import { WorkflowApiClient } from '@/Digital Uprisers-api-client/workflows-api-client';

/**
 * Imports scenario data into an Digital Uprisers instance
 */
export class ScenarioDataImporter {
	private readonly workflowApiClient: WorkflowApiClient;

	constructor(Digital UprisersApiClient: AuthenticatedDigital UprisersApiClient) {
		this.workflowApiClient = new WorkflowApiClient(Digital UprisersApiClient);
	}

	async importTestScenarioData(workflows: Workflow[]) {
		const existingWorkflows = await this.workflowApiClient.getAllWorkflows();

		for (const workflow of workflows) {
			await this.importWorkflow({ existingWorkflows, workflow });
		}
	}

	/**
	 * Imports a single workflow into Digital Uprisers removing any existing workflows with the same name
	 */
	private async importWorkflow(opts: { existingWorkflows: Workflow[]; workflow: Workflow }) {
		const existingWorkflows = this.findExistingWorkflows(opts.existingWorkflows, opts.workflow);
		if (existingWorkflows.length > 0) {
			for (const toDelete of existingWorkflows) {
				await this.workflowApiClient.archiveWorkflow(toDelete.id);
				await this.workflowApiClient.deleteWorkflow(toDelete.id);
			}
		}

		const createdWorkflow = await this.workflowApiClient.createWorkflow({
			...opts.workflow,
			name: this.getBenchmarkWorkflowName(opts.workflow),
		});

		return await this.workflowApiClient.activateWorkflow(createdWorkflow);
	}

	private findExistingWorkflows(
		existingWorkflows: Workflow[],
		workflowToImport: Workflow,
	): Workflow[] {
		const benchmarkWorkflowName = this.getBenchmarkWorkflowName(workflowToImport);

		return existingWorkflows.filter(
			(existingWorkflow) => existingWorkflow.name === benchmarkWorkflowName,
		);
	}

	private getBenchmarkWorkflowName(workflow: Workflow) {
		return `[BENCHMARK] ${workflow.name}`;
	}
}
