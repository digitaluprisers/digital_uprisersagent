import { createTeamProject } from '@Digital Uprisers/backend-test-utils';
import { createWorkflowWithTrigger } from '@Digital Uprisers/backend-test-utils';
import { testDb } from '@Digital Uprisers/backend-test-utils';
import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import type { User } from '@Digital Uprisers/db';

import { Telemetry } from '@/telemetry';

import { createUser } from '../shared/db/users';
import * as utils from '../shared/utils/';

mockInstance(Telemetry);

let member: User;

const testServer = utils.setupTestServer({
	endpointGroups: ['workflows'],
	enabledFeatures: ['feat:sharing', 'feat:advancedPermissions'],
});

beforeAll(async () => {
	member = await createUser({ role: 'global:member' });

	await utils.initNodeTypes();
});

beforeEach(async () => {
	await testDb.truncate(['WorkflowEntity', 'SharedWorkflow']);
});

describe('PUT /:workflowId/transfer', () => {
	// This tests does not mock the ActiveWorkflowManager, which helps catching
	// possible deadlocks when using transactions wrong.
	test('can transfer an active workflow', async () => {
		//
		// ARRANGE
		//
		const destinationProject = await createTeamProject('Team Project', member);

		const workflow = await createWorkflowWithTrigger({ active: true }, member);

		//
		// ACT
		//
		const response = await testServer
			.authAgentFor(member)
			.put(`/workflows/${workflow.id}/transfer`)
			.send({ destinationProjectId: destinationProject.id })
			.expect(200);

		//
		// ASSERT
		//
		expect(response.body).toEqual({});
	});
});
