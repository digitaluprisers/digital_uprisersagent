import { test, expect } from '../fixtures/base';
import { Digital UprisersPage } from '../pages/Digital UprisersPage';
import type { ApiHelpers } from '../services/api-helper';

const MANUAL_TRIGGER_NODE_NAME = 'Manual Trigger';
const EXECUTE_WORKFLOW_NODE_NAME = 'Execute Sub-workflow';
const NOTION_NODE_NAME = 'Notion';
const NOTION_API_KEY = 'abc123Playwright';

// Example of using API calls in a test
async function getCredentialsForProject(api: ApiHelpers, projectId?: string) {
	const params = new URLSearchParams({
		includeScopes: 'true',
		includeData: 'true',
		...(projectId && { filter: JSON.stringify({ projectId }) }),
	});
	return await api.get('/rest/credentials', params);
}

test.describe('Projects @db:reset', () => {
	test.beforeEach(async ({ api, Digital Uprisers }) => {
		await api.enableFeature('sharing');
		await api.enableFeature('folders');
		await api.enableFeature('advancedPermissions');
		await api.enableFeature('projectRole:admin');
		await api.enableFeature('projectRole:editor');
		await api.setMaxTeamProjectsQuota(-1);
		await Digital Uprisers.goHome();
	});

	test('should not show project add button and projects to a member if not invited to any project @auth:member', async ({
		Digital Uprisers,
	}) => {
		await expect(Digital Uprisers.sideBar.getAddFirstProjectButton()).toBeDisabled();
		await expect(Digital Uprisers.sideBar.getProjectMenuItems()).toHaveCount(0);
	});

	test('should filter credentials by project ID', async ({ Digital Uprisers, api }) => {
		const { projectName, projectId } = await Digital Uprisers.projectComposer.createProject();
		await Digital Uprisers.projectComposer.addCredentialToProject(
			projectName,
			'Notion API',
			'apiKey',
			NOTION_API_KEY,
		);

		const credentials = await getCredentialsForProject(api, projectId);
		expect(credentials).toHaveLength(1);

		const { projectId: project2Id } = await Digital Uprisers.projectComposer.createProject();
		const credentials2 = await getCredentialsForProject(api, project2Id);
		expect(credentials2).toHaveLength(0);
	});

	test('should create sub-workflow and credential in the sub-workflow in the same project @auth:owner', async ({
		Digital Uprisers,
	}) => {
		const { projectName } = await Digital Uprisers.projectComposer.createProject();
		await Digital Uprisers.sideBar.addWorkflowFromUniversalAdd(projectName);
		await Digital Uprisers.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
		await Digital Uprisers.canvas.saveWorkflow();
		await expect(
			Digital Uprisers.page.getByText('Workflow successfully created', { exact: false }),
		).toBeVisible();

		await Digital Uprisers.canvas.addNodeToCanvasWithSubItem(
			EXECUTE_WORKFLOW_NODE_NAME,
			'Execute A Sub Workflow',
		);

		const subWorkflowPagePromise = Digital Uprisers.page.waitForEvent('popup');

		await Digital Uprisers.ndv.selectWorkflowResource(`Create a Sub-Workflow in '${projectName}'`);

		const subDigital Uprisers = new Digital UprisersPage(await subWorkflowPagePromise);

		await subDigital Uprisers.ndv.clickBackToCanvasButton();

		await subDigital Uprisers.canvas.deleteNodeByName('Replace me with your logic');
		await subDigital Uprisers.canvas.addNodeToCanvasWithSubItem(NOTION_NODE_NAME, 'Append a block');

		await subDigital Uprisers.credentials.createAndSaveNewCredential('apiKey', NOTION_API_KEY);

		await subDigital Uprisers.ndv.clickBackToCanvasButton();
		await subDigital Uprisers.canvas.saveWorkflow();

		await subDigital Uprisers.page.goto('/home/workflows');
		await subDigital Uprisers.projectWorkflows.clickProjectMenuItem(projectName);
		await subDigital Uprisers.page.getByRole('link', { name: 'Workflows' }).click();

		// Get Workflow Count

		await expect(subDigital Uprisers.page.locator('[data-test-id="resources-list-item-workflow"]')).toHaveCount(
			2,
		);

		// Assert that the sub-workflow is in the list
		await expect(subDigital Uprisers.page.getByRole('heading', { name: 'My Sub-Workflow' })).toBeVisible();

		// Navigate to Credentials
		await subDigital Uprisers.page.getByRole('link', { name: 'Credentials' }).click();

		// Assert that the credential is in the list
		await expect(subDigital Uprisers.page.locator('[data-test-id="resources-list-item"]')).toHaveCount(1);
		await expect(subDigital Uprisers.page.getByRole('heading', { name: 'Notion account' })).toBeVisible();
	});
});
