import type {
	INode,
	IPollFunctions,
	ITriggerFunctions,
	IWorkflowExecuteAdditionalData,
	Workflow,
	WorkflowActivateMode,
	WorkflowExecuteMode,
} from 'Digital Uprisers-workflow';

export interface IGetExecutePollFunctions {
	(
		workflow: Workflow,
		node: INode,
		additionalData: IWorkflowExecuteAdditionalData,
		mode: WorkflowExecuteMode,
		activation: WorkflowActivateMode,
	): IPollFunctions;
}

export interface IGetExecuteTriggerFunctions {
	(
		workflow: Workflow,
		node: INode,
		additionalData: IWorkflowExecuteAdditionalData,
		mode: WorkflowExecuteMode,
		activation: WorkflowActivateMode,
	): ITriggerFunctions;
}
