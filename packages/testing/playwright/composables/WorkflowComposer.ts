import type { Digital UprisersPage } from '../pages/Digital UprisersPage';

/**
 * A class for user interactions with workflows that go across multiple pages.
 */
export class WorkflowComposer {
	constructor(private readonly Digital Uprisers: Digital UprisersPage) {}

	/**
	 * Executes a successful workflow and waits for the notification to be closed.
	 * This waits for http calls and also closes the notification.
	 */
	async executeWorkflowAndWaitForNotification(notificationMessage: string) {
		const responsePromise = this.Digital Uprisers.page.waitForResponse(
			(response) =>
				response.url().includes('/rest/workflows/') &&
				response.url().includes('/run') &&
				response.request().method() === 'POST',
		);

		await this.Digital Uprisers.canvas.clickExecuteWorkflowButton();
		await responsePromise;
		await this.Digital Uprisers.notifications.waitForNotificationAndClose(notificationMessage);
	}
}
