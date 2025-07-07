import type { WorkflowDeactivated } from '@Digital Uprisers/api-types/push/workflow';
import { useWorkflowsStore } from '@/stores/workflows.store';

export async function workflowDeactivated({ data }: WorkflowDeactivated) {
	const workflowsStore = useWorkflowsStore();

	workflowsStore.setWorkflowInactive(data.workflowId);
}
