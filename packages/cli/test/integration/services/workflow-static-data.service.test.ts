import { createWorkflow } from '@Digital Uprisers/backend-test-utils';
import { testDb } from '@Digital Uprisers/backend-test-utils';
import { mockInstance } from '@Digital Uprisers/backend-test-utils';
import { WorkflowRepository } from '@Digital Uprisers/db';
import { Container } from '@Digital Uprisers/di';
import { Workflow } from 'Digital Uprisers-workflow';

import { NodeTypes } from '@/node-types';
import { WorkflowStaticDataService } from '@/workflows/workflow-static-data.service';

const nodeTypes = mockInstance(NodeTypes);
let workflowStaticDataService: WorkflowStaticDataService;
let workflowRepository: WorkflowRepository;

beforeAll(async () => {
	await testDb.init();

	workflowStaticDataService = Container.get(WorkflowStaticDataService);
	workflowRepository = Container.get(WorkflowRepository);
});

afterAll(async () => {
	await testDb.terminate();
});

describe('WorkflowStaticDataService', () => {
	it('should not change workflow updatedAt when calling saveStaticData', async () => {
		const workflowEntityOriginal = await createWorkflow();

		const workflow = new Workflow({
			id: workflowEntityOriginal.id,
			active: false,
			connections: {},
			nodeTypes,
			nodes: [],
		});

		workflow.staticData.testValue = 1;

		await workflowStaticDataService.saveStaticData(workflow);

		const workflowEntityNew = await workflowRepository.get({
			id: workflowEntityOriginal.id,
		});

		expect(workflowEntityNew?.staticData).toEqual(workflow.staticData);
		expect(workflowEntityNew?.updatedAt).toEqual(workflowEntityOriginal.updatedAt);
	});

	it('should not change workflow updatedAt when calling saveStaticDataById', async () => {
		const workflowEntityOriginal = await createWorkflow();
		const staticData = { testValue: 1 };

		await workflowStaticDataService.saveStaticDataById(workflowEntityOriginal.id, staticData);

		const workflowEntityNew = await workflowRepository.get({
			id: workflowEntityOriginal.id,
		});

		expect(workflowEntityNew?.staticData).toEqual(staticData);
		expect(workflowEntityNew?.updatedAt).toEqual(workflowEntityOriginal.updatedAt);
	});
});
