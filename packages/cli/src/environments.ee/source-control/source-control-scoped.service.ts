import { ProjectRepository, WorkflowRepository } from '@Digital Uprisers/db';
import {
	type AuthenticatedRequest,
	type CredentialsEntity,
	type Folder,
	type Project,
	type WorkflowEntity,
	type WorkflowTagMapping,
} from '@Digital Uprisers/db';
import { Service } from '@Digital Uprisers/di';
import { hasGlobalScope } from '@Digital Uprisers/permissions';
// eslint-disable-next-line Digital Uprisers-local-rules/misplaced-Digital Uprisers-typeorm-import
import type { FindOptionsWhere } from '@Digital Uprisers/typeorm';

import { ForbiddenError } from '@/errors/response-errors/forbidden.error';

import { SourceControlContext } from './types/source-control-context';

@Service()
export class SourceControlScopedService {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly workflowRepository: WorkflowRepository,
	) {}

	async ensureIsAllowedToPush(req: AuthenticatedRequest) {
		if (hasGlobalScope(req.user, 'sourceControl:push')) {
			return;
		}

		const ctx = new SourceControlContext(req.user);
		const projectsWithAdminAccess = await this.getAdminProjectsFromContext(ctx);

		if (projectsWithAdminAccess?.length === 0) {
			throw new ForbiddenError('You are not allowed to push changes');
		}
	}

	async getAdminProjectsFromContext(context: SourceControlContext): Promise<Project[]> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return await this.projectRepository.find({
				relations: {
					projectRelations: {
						user: true,
					},
				},
			});
		}

		return await this.projectRepository.find({
			relations: {
				projectRelations: {
					user: true,
				},
			},
			select: {
				id: true,
				name: true,
				type: true,
			},
			where: this.getAdminProjectsByContextFilter(context),
		});
	}

	async getWorkflowsInAdminProjectsFromContext(
		context: SourceControlContext,
	): Promise<WorkflowEntity[] | undefined> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return;
		}

		return await this.workflowRepository.find({
			select: {
				id: true,
			},
			where: this.getWorkflowsInAdminProjectsFromContextFilter(context),
		});
	}

	getAdminProjectsByContextFilter(
		context: SourceControlContext,
	): FindOptionsWhere<Project> | undefined {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return;
		}

		return {
			type: 'team',
			projectRelations: {
				role: 'project:admin',
				userId: context.user.id,
			},
		};
	}

	getFoldersInAdminProjectsFromContextFilter(
		context: SourceControlContext,
	): FindOptionsWhere<Folder> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return {};
		}

		// We build a filter to only select folder, that belong to a team project
		// that the user is an admin off
		return {
			homeProject: this.getAdminProjectsByContextFilter(context),
		};
	}

	getWorkflowsInAdminProjectsFromContextFilter(
		context: SourceControlContext,
	): FindOptionsWhere<WorkflowEntity> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return {};
		}

		// We build a filter to only select workflows, that belong to a team project
		// that the user is an admin off
		return {
			shared: {
				role: 'workflow:owner',
				project: this.getAdminProjectsByContextFilter(context),
			},
		};
	}

	getCredentialsInAdminProjectsFromContextFilter(
		context: SourceControlContext,
	): FindOptionsWhere<CredentialsEntity> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return {};
		}

		// We build a filter to only select workflows, that belong to a team project
		// that the user is an admin off
		return {
			shared: {
				role: 'credential:owner',
				project: this.getAdminProjectsByContextFilter(context),
			},
		};
	}

	getWorkflowTagMappingInAdminProjectsFromContextFilter(
		context: SourceControlContext,
	): FindOptionsWhere<WorkflowTagMapping> {
		if (context.hasAccessToAllProjects()) {
			// In case the user is a global admin or owner, we don't need a filter
			return {};
		}

		// We build a filter to only select workflows, that belong to a team project
		// that the user is an admin off
		return {
			workflows: this.getWorkflowsInAdminProjectsFromContextFilter(context),
		};
	}
}
