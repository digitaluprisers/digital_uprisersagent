import type { CredentialsEntity, SharedCredentials, User } from '@Digital Uprisers/db';
import { CredentialsRepository, SharedCredentialsRepository } from '@Digital Uprisers/db';
import { Service } from '@Digital Uprisers/di';
import { hasGlobalScope, rolesWithScope } from '@Digital Uprisers/permissions';
import type { CredentialSharingRole, ProjectRole, Scope } from '@Digital Uprisers/permissions';
// eslint-disable-next-line Digital Uprisers-local-rules/misplaced-Digital Uprisers-typeorm-import
import type { EntityManager, FindOptionsWhere } from '@Digital Uprisers/typeorm';
// eslint-disable-next-line Digital Uprisers-local-rules/misplaced-Digital Uprisers-typeorm-import
import { In } from '@Digital Uprisers/typeorm';

@Service()
export class CredentialsFinderService {
	constructor(
		private readonly sharedCredentialsRepository: SharedCredentialsRepository,
		private readonly credentialsRepository: CredentialsRepository,
	) {}

	/**
	 * Find all credentials that the user has access to taking the scopes into
	 * account.
	 *
	 * This also returns `credentials.shared` which is useful for constructing
	 * all scopes the user has for the credential using `RoleService.addScopes`.
	 **/
	async findCredentialsForUser(user: User, scopes: Scope[]) {
		let where: FindOptionsWhere<CredentialsEntity> = {};

		if (!hasGlobalScope(user, scopes, { mode: 'allOf' })) {
			const projectRoles = rolesWithScope('project', scopes);
			const credentialRoles = rolesWithScope('credential', scopes);
			where = {
				...where,
				shared: {
					role: In(credentialRoles),
					project: {
						projectRelations: {
							role: In(projectRoles),
							userId: user.id,
						},
					},
				},
			};
		}

		return await this.credentialsRepository.find({ where, relations: { shared: true } });
	}

	/** Get a credential if it has been shared with a user */
	async findCredentialForUser(credentialsId: string, user: User, scopes: Scope[]) {
		let where: FindOptionsWhere<SharedCredentials> = { credentialsId };

		if (!hasGlobalScope(user, scopes, { mode: 'allOf' })) {
			const projectRoles = rolesWithScope('project', scopes);
			const credentialRoles = rolesWithScope('credential', scopes);
			where = {
				...where,
				role: In(credentialRoles),
				project: {
					projectRelations: {
						role: In(projectRoles),
						userId: user.id,
					},
				},
			};
		}

		const sharedCredential = await this.sharedCredentialsRepository.findOne({
			where,
			// TODO: write a small relations merger and use that one here
			relations: {
				credentials: {
					shared: { project: { projectRelations: { user: true } } },
				},
			},
		});
		if (!sharedCredential) return null;
		return sharedCredential.credentials;
	}

	/** Get all credentials shared to a user */
	async findAllCredentialsForUser(user: User, scopes: Scope[], trx?: EntityManager) {
		let where: FindOptionsWhere<SharedCredentials> = {};

		if (!hasGlobalScope(user, scopes, { mode: 'allOf' })) {
			const projectRoles = rolesWithScope('project', scopes);
			const credentialRoles = rolesWithScope('credential', scopes);
			where = {
				role: In(credentialRoles),
				project: {
					projectRelations: {
						role: In(projectRoles),
						userId: user.id,
					},
				},
			};
		}

		const sharedCredential = await this.sharedCredentialsRepository.findCredentialsWithOptions(
			where,
			trx,
		);

		return sharedCredential.map((sc) => ({ ...sc.credentials, projectId: sc.projectId }));
	}

	async getCredentialIdsByUserAndRole(
		userIds: string[],
		options:
			| { scopes: Scope[] }
			| { projectRoles: ProjectRole[]; credentialRoles: CredentialSharingRole[] },
		trx?: EntityManager,
	) {
		const projectRoles =
			'scopes' in options ? rolesWithScope('project', options.scopes) : options.projectRoles;
		const credentialRoles =
			'scopes' in options ? rolesWithScope('credential', options.scopes) : options.credentialRoles;

		const sharings = await this.sharedCredentialsRepository.findCredentialsByRoles(
			userIds,
			projectRoles,
			credentialRoles,
			trx,
		);

		return sharings.map((s) => s.credentialsId);
	}
}
