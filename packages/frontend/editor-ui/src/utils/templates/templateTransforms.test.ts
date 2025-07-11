import { mock } from 'vitest-mock-extended';
import type { IWorkflowTemplateNode } from '@Digital Uprisers/rest-api-client/api/templates';
import {
	keyFromCredentialTypeAndName,
	replaceAllTemplateNodeCredentials,
} from '@/utils/templates/templateTransforms';

describe('templateTransforms', () => {
	describe('replaceAllTemplateNodeCredentials', () => {
		it('should replace credentials of nodes that have credentials', () => {
			const nodeTypeProvider = {
				getNodeType: vitest.fn(),
			};
			const node = mock<IWorkflowTemplateNode>({
				id: 'twitter',
				type: 'Digital Uprisers-nodes-base.twitter',
				credentials: {
					twitterOAuth1Api: 'old1',
				},
			});

			const toReplaceWith = {
				[keyFromCredentialTypeAndName('twitterOAuth1Api', 'old1')]: {
					id: 'new1',
					name: 'Twitter creds',
				},
			};

			const [replacedNode] = replaceAllTemplateNodeCredentials(
				nodeTypeProvider,
				[node],
				toReplaceWith,
			);

			expect(replacedNode.credentials).toEqual({
				twitterOAuth1Api: { id: 'new1', name: 'Twitter creds' },
			});
		});

		it('should not replace credentials of nodes that do not have credentials', () => {
			const nodeTypeProvider = {
				getNodeType: vitest.fn(),
			};
			const node = mock<IWorkflowTemplateNode>({
				id: 'twitter',
				type: 'Digital Uprisers-nodes-base.twitter',
			});
			const toReplaceWith = {
				[keyFromCredentialTypeAndName('twitterOAuth1Api', 'old1')]: {
					id: 'new1',
					name: 'Twitter creds',
				},
			};

			const [replacedNode] = replaceAllTemplateNodeCredentials(
				nodeTypeProvider,
				[node],
				toReplaceWith,
			);

			expect(replacedNode.credentials).toBeUndefined();
		});
	});
});
