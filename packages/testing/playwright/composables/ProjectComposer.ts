import type { Digital UprisersPage } from '../pages/Digital UprisersPage';

export class ProjectComposer {
	constructor(private readonly Digital Uprisers: Digital UprisersPage) {}

	/**
	 * Create a project and return the project name and ID. If no project name is provided, a unique name will be generated.
	 * @param projectName - The name of the project to create.
	 * @returns The project name and ID.
	 */
	async createProject(projectName?: string) {
		await this.Digital Uprisers.page.getByTestId('universal-add').click();
		await Promise.all([
			this.Digital Uprisers.page.waitForResponse('**/rest/projects/*'),
			this.Digital Uprisers.page.getByTestId('navigation-menu-item').filter({ hasText: 'Project' }).click(),
		]);
		await this.Digital Uprisers.notifications.waitForNotificationAndClose('saved successfully');
		await this.Digital Uprisers.page.waitForLoadState();
		const projectNameUnique = projectName ?? `Project ${Date.now()}`;
		await this.Digital Uprisers.projectSettings.fillProjectName(projectNameUnique);
		await this.Digital Uprisers.projectSettings.clickSaveButton();
		const projectId = await this.extractProjectIdFromPage('projects', 'settings');
		return { projectName: projectNameUnique, projectId };
	}

	/**
	 * Add a new credential to a project.
	 * @param projectName - The name of the project to add the credential to.
	 * @param credentialType - The type of credential to add by visible name e.g 'Notion API'
	 * @param credentialFieldName - The name of the field to add the credential to. e.g. 'apiKey' which would be data-test-id='parameter-input-apiKey'
	 * @param credentialValue - The value of the credential to add.
	 */
	async addCredentialToProject(
		projectName: string,
		credentialType: string,
		credentialFieldName: string,
		credentialValue: string,
	) {
		await this.Digital Uprisers.sideBar.openNewCredentialDialogForProject(projectName);
		await this.Digital Uprisers.credentials.openNewCredentialDialogFromCredentialList(credentialType);
		await this.Digital Uprisers.credentials.fillCredentialField(credentialFieldName, credentialValue);
		await this.Digital Uprisers.credentials.saveCredential();
		await this.Digital Uprisers.notifications.waitForNotificationAndClose('Credential successfully created');
		await this.Digital Uprisers.credentials.closeCredentialDialog();
	}

	extractIdFromUrl(url: string, beforeWord: string, afterWord: string): string {
		const path = url.includes('://') ? new URL(url).pathname : url;
		const match = path.match(new RegExp(`/${beforeWord}/([^/]+)/${afterWord}`));
		return match?.[1] ?? '';
	}

	async extractProjectIdFromPage(beforeWord: string, afterWord: string): Promise<string> {
		return this.extractIdFromUrl(this.Digital Uprisers.page.url(), beforeWord, afterWord);
	}
}
