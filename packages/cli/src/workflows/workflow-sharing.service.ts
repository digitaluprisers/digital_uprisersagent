import type { User } from '@Digital Uprisers/db';
import { ProjectRelationRepository, SharedWorkflowRepository } from '@Digital Uprisers/db';
import { Service } from '@Digital Uprisers/di';
import {
	hasGlobalScope,
	rolesWithScope,
	type ProjectRole,
	type WorkflowSharingRole,
	type Scope,
} from '@Digital Uprisers/permissions';
// eslint-disable-next-line Digital Uprisers-local-rules/misplaced-Digital Uprisers-typeorm-import
import { In } from '@Digital Uprisers/typeorm';

import { RoleService } from '@/services/role.service';

export type ShareWorkflowOptions =
	| { scopes: Scope[]; projectId?: string }
	| { projectRoles: ProjectRole[]; workflowRoles: WorkflowSharingRole[]; projectId?: string };

@Service()
export class WorkflowSharingService {
	constructor(
		private readonly sharedWorkflowRepository: SharedWorkflowRepository,
		private readonly roleService: RoleService,
		private readonly projectRelationRepository: ProjectRelationRepository,
	) {}

	/**
	 * Get the IDs of the workflows that have been shared with the user based on
	 * scope or roles.
	 * If `scopes` is passed the roles are inferred. Alternatively `projectRoles`
	 * and `workflowRoles` can be passed specifically.
	 *
	 * Returns all IDs if user has the 'workflow:read' global scope.
	 */

	async getSharedWorkflowIds(user: User, options: ShareWorkflowOptions): Promise<string[]> {
		const { projectId } = options;

		if (hasGlobalScope(user, 'workflow:read')) {
			const sharedWorkflows = await this.sharedWorkflowRepository.find({
				select: ['workflowId'],
				...(projectId && { where: { projectId } }),
			});
			return sharedWorkflows.map(({ workflowId }) => workflowId);
		}

		const projectRoles =
			'scopes' in options ? rolesWithScope('project', options.scopes) : options.projectRoles;
		const workflowRoles =
			'scopes' in options ? rolesWithScope('workflow', options.scopes) : options.workflowRoles;

		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			where: {
				role: In(workflowRoles),
				project: {
					projectRelations: {
						userId: user.id,
						role: In(projectRoles),
					},
				},
			},
			select: ['workflowId'],
		});

		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWithMeIds(user: User) {
		const sharedWithMeWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:editor',
				project: {
					projectRelations: {
						userId: user.id,
						role: 'project:personalOwner',
					},
				},
			},
		});

		return sharedWithMeWorkflows.map(({ workflowId }) => workflowId);
	}

	async getSharedWorkflowScopes(
		workflowIds: string[],
		user: User,
	): Promise<Array<[string, Scope[]]>> {
		const projectRelations = await this.projectRelationRepository.findAllByUser(user.id);
		const sharedWorkflows =
			await this.sharedWorkflowRepository.getRelationsByWorkflowIdsAndProjectIds(
				workflowIds,
				projectRelations.map((p) => p.projectId),
			);

		return workflowIds.map((workflowId) => {
			return [
				workflowId,
				this.roleService.combineResourceScopes(
					'workflow',
					user,
					sharedWorkflows.filter((s) => s.workflowId === workflowId),
					projectRelations,
				),
			];
		});
	}

	async getOwnedWorkflowsInPersonalProject(user: User): Promise<string[]> {
		const sharedWorkflows = await this.sharedWorkflowRepository.find({
			select: ['workflowId'],
			where: {
				role: 'workflow:owner',
				project: {
					projectRelations: {
						userId: user.id,
						role: 'project:personalOwner',
					},
				},
			},
		});
		return sharedWorkflows.map(({ workflowId }) => workflowId);
	}
}
