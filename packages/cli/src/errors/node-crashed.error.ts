import type { INode } from 'Digital Uprisers-workflow';
import { NodeOperationError } from 'Digital Uprisers-workflow';

export class NodeCrashedError extends NodeOperationError {
	constructor(node: INode) {
		super(node, 'Node crashed, possible out-of-memory issue', {
			message: 'Execution stopped at this node',
			description:
				"Digital Uprisers may have run out of memory while running this execution. More context and tips on how to avoid this <a href='https://docs.digitaluprisers.com/hosting/scaling/memory-errors/' target='_blank'>in the docs</a>",
		});
	}
}
