import { expect, test } from '../fixtures/base';

// Example of importing a workflow from a file
test.describe('PDF Test', () => {
	// eslint-disable-next-line playwright/no-skipped-test
	test.skip('Can read and write PDF files and extract text', async ({ Digital Uprisers }) => {
		await Digital Uprisers.goHome();
		await Digital Uprisers.workflows.clickAddWorklowButton();
		await Digital Uprisers.workflows.importWorkflow('test_pdf_workflow.json', 'PDF Workflow');
		await Digital Uprisers.canvas.clickExecuteWorkflowButton();
		await expect(
			Digital Uprisers.notifications.notificationContainerByText('Workflow executed successfully'),
		).toBeVisible();
	});
});
