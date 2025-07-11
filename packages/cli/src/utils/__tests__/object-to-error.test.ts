import { mock } from 'jest-mock-extended';
import type { INode } from 'Digital Uprisers-workflow';
import { NodeOperationError, type Workflow } from 'Digital Uprisers-workflow';

import { objectToError } from '../object-to-error';

describe('objectToError', () => {
	describe('node error handling', () => {
		it('should create `NodeOperationError` when node is found', () => {
			const errorObject = {
				message: 'Test error',
				node: {
					name: 'testNode',
				},
			};
			const workflow = mock<Workflow>();
			const node = mock<INode>();
			workflow.getNode.mockReturnValue(node);

			const result = objectToError(errorObject, workflow);

			expect(workflow.getNode).toHaveBeenCalledWith('testNode');
			expect(result).toBeInstanceOf(NodeOperationError);
		});

		it('should create `Error` when node is not found', () => {
			const errorObject = {
				message: 'Test error',
				node: {
					// missing `name`
				},
			};
			const workflow = mock<Workflow>();

			const result = objectToError(errorObject, workflow);

			expect(workflow.getNode).not.toHaveBeenCalled();
			expect(result).toBeInstanceOf(Error);
			expect(result).not.toBeInstanceOf(NodeOperationError);
			expect(result.message).toBe('Test error');
		});
	});
});
