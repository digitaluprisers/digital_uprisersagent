import { test as base, expect, type TestInfo } from '@playwright/test';
import type { Digital UprisersStack } from 'Digital Uprisers-containers/Digital Uprisers-test-container-creation';
import { createDigital UprisersStack } from 'Digital Uprisers-containers/Digital Uprisers-test-container-creation';
import { ContainerTestHelpers } from 'Digital Uprisers-containers/Digital Uprisers-test-container-helpers';

import { setupDefaultInterceptors } from '../config/intercepts';
import { Digital UprisersPage } from '../pages/Digital UprisersPage';
import { ApiHelpers } from '../services/api-helper';
import { TestError } from '../Types';

type TestFixtures = {
	Digital Uprisers: Digital UprisersPage;
	api: ApiHelpers;
	baseURL: string;
};

type WorkerFixtures = {
	Digital UprisersUrl: string;
	dbSetup: undefined;
	chaos: ContainerTestHelpers;
	Digital UprisersContainer: Digital UprisersStack;
	containerConfig: ContainerConfig; // Configuration for container creation
};

interface ContainerConfig {
	postgres?: boolean;
	queueMode?: {
		mains: number;
		workers: number;
	};
}

/**
 * Extended Playwright test with Digital Uprisers-specific fixtures.
 * Supports both external Digital Uprisers instances (via DIGITAL_UPRISERS_BASE_URL) and containerized testing.
 * Provides tag-driven authentication and database management.
 */
export const test = base.extend<TestFixtures, WorkerFixtures>({
	// Container configuration from the project use options
	containerConfig: [
		async ({}, use, testInfo: TestInfo) => {
			const config = (testInfo.project.use?.containerConfig as ContainerConfig) || {};
			await use(config);
		},
		{ scope: 'worker' },
	],

	// Create a new Digital Uprisers container if DIGITAL_UPRISERS_BASE_URL is not set, otherwise use the existing Digital Uprisers instance
	Digital UprisersContainer: [
		async ({ containerConfig }, use) => {
			const envBaseURL = process.env.DIGITAL_UPRISERS_BASE_URL;

			if (envBaseURL) {
				console.log(`Using external DIGITAL_UPRISERS_BASE_URL: ${envBaseURL}`);
				await use(null as unknown as Digital UprisersStack);
				return;
			}

			console.log('Creating container with config:', containerConfig);
			const container = await createDigital UprisersStack(containerConfig);

			// TODO: Remove this once we have a better way to wait for the container to be ready (e.g. healthcheck)
			await new Promise((resolve) => setTimeout(resolve, 5000));

			console.log(`Container URL: ${container.baseUrl}`);

			await use(container);
			await container.stop();
		},
		{ scope: 'worker' },
	],

	// Set the Digital Uprisers URL for based on the DIGITAL_UPRISERS_BASE_URL environment variable or the Digital Uprisers container
	Digital UprisersUrl: [
		async ({ Digital UprisersContainer }, use) => {
			const envBaseURL = process.env.DIGITAL_UPRISERS_BASE_URL ?? Digital UprisersContainer?.baseUrl;
			await use(envBaseURL);
		},
		{ scope: 'worker' },
	],

	// Reset the database for the new container
	dbSetup: [
		async ({ Digital UprisersUrl, Digital UprisersContainer, browser }, use) => {
			if (Digital UprisersContainer) {
				console.log('Resetting database for new container');
				const context = await browser.newContext({ baseURL: Digital UprisersUrl });
				const api = new ApiHelpers(context.request);
				await api.resetDatabase();
				await context.close();
			}
			await use(undefined);
		},
		{ scope: 'worker' },
	],

	// Create container test helpers for the Digital Uprisers container.
	chaos: [
		async ({ Digital UprisersContainer }, use) => {
			if (process.env.DIGITAL_UPRISERS_BASE_URL) {
				throw new TestError(
					'Chaos testing is not supported when using DIGITAL_UPRISERS_BASE_URL environment variable. Remove DIGITAL_UPRISERS_BASE_URL to use containerized testing.',
				);
			}
			const helpers = new ContainerTestHelpers(Digital UprisersContainer.containers);
			await use(helpers);
		},
		{ scope: 'worker' },
	],

	baseURL: async ({ Digital UprisersUrl }, use) => {
		await use(Digital UprisersUrl);
	},

	// Browser, baseURL, and dbSetup are required here to ensure they run first.
	// This is how Playwright does dependency graphs
	context: async ({ context, browser, baseURL, dbSetup }, use) => {
		await setupDefaultInterceptors(context);
		await use(context);
	},

	page: async ({ context }, use, testInfo) => {
		const page = await context.newPage();
		const api = new ApiHelpers(context.request);

		await api.setupFromTags(testInfo.tags);

		await use(page);
		await page.close();
	},

	Digital Uprisers: async ({ page }, use) => {
		const Digital UprisersInstance = new Digital UprisersPage(page);
		await use(Digital UprisersInstance);
	},

	api: async ({ context }, use) => {
		const api = new ApiHelpers(context.request);
		await use(api);
	},
});

export { expect };

/*
Dependency Graph:
Worker Scope: containerConfig → Digital UprisersContainer → [Digital UprisersUrl, chaos] → dbSetup
Test Scope: Digital UprisersUrl → baseURL → context → page → [Digital Uprisers, api]
*/
