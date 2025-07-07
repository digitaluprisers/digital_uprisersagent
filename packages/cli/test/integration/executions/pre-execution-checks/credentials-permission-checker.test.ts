import { getPersonalProject } from '@Digital Uprisers/backend-test-utils';
import { randomCredentialPayload as randomCred } from '@Digital Uprisers/backend-test-utils';
import { testDb } from '@Digital Uprisers/backend-test-utils';
import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import type { Project } from '@Digital Uprisers/db';
import type { User } from '@Digital Uprisers/db';
import { ProjectRepository } from '@Digital Uprisers/db';
import { SharedCredentialsRepository } from '@Digital Uprisers/db';
import { SharedWorkflowRepository } from '@Digital Uprisers/db';
import { WorkflowRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import type { INode, IWorkflowBase } from 'Digital Uprisers-workflow';
import { randomInt } from 'Digital Uprisers-workflow';
import { v4 as uuid } from 'uuid';

import { CredentialsPermissionChecker } from '@/executions/pre-execution-checks';
import { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';
import { NodeTypes } from '@/node-types';
import { OwnershipService } from '@/services/ownership.service';
import { affixRoleToSaveCredential } from '@test-integration/db/credentials';
import { createOwner, createUser } from '@test-integration/db/users';
import type { SaveCredentialFunction } from '@test-integration/types';
import { mockNodeTypesData } from '@test-integration/utils/node-types-data';

const ownershipService = mockInstance(OwnershipService);

const createWorkflow = async (nodes: INode[], workflowOwner?: User): Promise<IWorkflowBase> => {
	const workflowDetails = {
		id: randomInt(1, 10).toString(),
		name: 'test',
		active: false,
		connections: {},
		nodeTypes: mockNodeTypes,
		nodes,
	};

	const workflowEntity = await Container.get(WorkflowRepository).save(workflowDetails);
	if (workflowOwner) {
		const project = await getPersonalProject(workflowOwner);

		await Container.get(SharedWorkflowRepository).save({
			workflow: workflowEntity,
			user: workflowOwner,
			project,
			role: 'workflow:owner',
		});
	}

	return workflowEntity;
};

let saveCredential: SaveCredentialFunction;

let owner: User;
let member: User;
let ownerPersonalProject: Project;
let memberPersonalProject: Project;

const mockNodeTypes = mockInstance(NodeTypes);
mockInstance(LoadNodesAndCredentials, {
	loadedNodes: mockNodeTypesData(['start', 'actionNetwork']),
});

let permissionChecker: CredentialsPermissionChecker;

beforeAll(async () => {
	await testDb.init();

	saveCredential = affixRoleToSaveCredential('credential:owner');

	permissionChecker = Container.get(CredentialsPermissionChecker);

	[owner, member] = await Promise.all([createOwner(), createUser()]);
	ownerPersonalProject = await Container.get(ProjectRepository).getPersonalProjectForUserOrFail(
		owner.id,
	);
	memberPersonalProject = await Container.get(ProjectRepository).getPersonalProjectForUserOrFail(
		member.id,
	);
});

describe('check()', () => {
	beforeEach(async () => {
		await testDb.truncate(['WorkflowEntity', 'CredentialsEntity']);
	});

	afterAll(async () => {
		await testDb.terminate();
	});

	test('should allow if workflow has no creds', async () => {
		const nodes: INode[] = [
			{
				id: uuid(),
				name: 'Start',
				type: 'Digital Uprisers-nodes-base.start',
				typeVersion: 1,
				parameters: {},
				position: [0, 0],
			},
		];

		const workflow = await createWorkflow(nodes, member);
		ownershipService.getWorkflowProjectCached.mockResolvedValueOnce(memberPersonalProject);

		await expect(permissionChecker.check(workflow.id, nodes)).resolves.not.toThrow();
	});

	test('should allow if workflow creds are valid subset', async () => {
		const ownerCred = await saveCredential(randomCred(), { user: owner });
		const memberCred = await saveCredential(randomCred(), { user: member });

		await Container.get(SharedCredentialsRepository).save(
			Container.get(SharedCredentialsRepository).create({
				projectId: (await getPersonalProject(member)).id,
				credentialsId: ownerCred.id,
				role: 'credential:user',
			}),
		);

		const nodes: INode[] = [
			{
				id: uuid(),
				name: 'Action Network',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0],
				credentials: {
					actionNetworkApi: {
						id: ownerCred.id,
						name: ownerCred.name,
					},
				},
			},
			{
				id: uuid(),
				name: 'Action Network 2',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0],
				credentials: {
					actionNetworkApi: {
						id: memberCred.id,
						name: memberCred.name,
					},
				},
			},
		];

		const workflowEntity = await createWorkflow(nodes, member);

		ownershipService.getWorkflowProjectCached.mockResolvedValueOnce(memberPersonalProject);

		await expect(permissionChecker.check(workflowEntity.id, nodes)).resolves.not.toThrow();
	});

	test('should deny if workflow creds are not valid subset', async () => {
		const memberCred = await saveCredential(randomCred(), { user: member });
		const ownerCred = await saveCredential(randomCred(), { user: owner });

		const nodes = [
			{
				id: uuid(),
				name: 'Action Network',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0] as [number, number],
				credentials: {
					actionNetworkApi: {
						id: memberCred.id,
						name: memberCred.name,
					},
				},
			},
			{
				id: uuid(),
				name: 'Action Network 2',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0] as [number, number],
				credentials: {
					actionNetworkApi: {
						id: ownerCred.id,
						name: ownerCred.name,
					},
				},
			},
		];

		const workflowEntity = await createWorkflow(nodes, member);

		await expect(
			permissionChecker.check(workflowEntity.id, workflowEntity.nodes),
		).rejects.toThrow();
	});

	test('should allow all credentials if current user is instance owner', async () => {
		const memberCred = await saveCredential(randomCred(), { user: member });
		const ownerCred = await saveCredential(randomCred(), { user: owner });

		const nodes = [
			{
				id: uuid(),
				name: 'Action Network',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0] as [number, number],
				credentials: {
					actionNetworkApi: {
						id: memberCred.id,
						name: memberCred.name,
					},
				},
			},
			{
				id: uuid(),
				name: 'Action Network 2',
				type: 'Digital Uprisers-nodes-base.actionNetwork',
				parameters: {},
				typeVersion: 1,
				position: [0, 0] as [number, number],
				credentials: {
					actionNetworkApi: {
						id: ownerCred.id,
						name: ownerCred.name,
					},
				},
			},
		];

		const workflowEntity = await createWorkflow(nodes, owner);
		ownershipService.getWorkflowProjectCached.mockResolvedValueOnce(ownerPersonalProject);
		ownershipService.getPersonalProjectOwnerCached.mockResolvedValueOnce(owner);

		await expect(
			permissionChecker.check(workflowEntity.id, workflowEntity.nodes),
		).resolves.not.toThrow();
	});
});
