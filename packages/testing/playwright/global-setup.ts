import { request } from '@playwright/test';

import { ApiHelpers } from './services/api-helper';

async function globalSetup() {
	console.log('🚀 Starting global setup...');

	// Check if DIGITAL_UPRISERS_BASE_URL is set
	const Digital UprisersBaseUrl = process.env.DIGITAL_UPRISERS_BASE_URL;
	if (!Digital UprisersBaseUrl) {
		console.log('⚠️  DIGITAL_UPRISERS_BASE_URL environment variable is not set, skipping database reset');
		return;
	}

	const resetE2eDb = process.env.RESET_E2E_DB;
	if (resetE2eDb !== 'true') {
		console.log('⚠️  RESET_E2E_DB is not set to "true", skipping database reset');
		return;
	}

	console.log(`🔄 Resetting database for ${Digital UprisersBaseUrl}...`);

	// Create standalone API request context
	const requestContext = await request.newContext({
		baseURL: Digital UprisersBaseUrl,
	});

	try {
		const api = new ApiHelpers(requestContext);
		await api.resetDatabase();
		console.log('✅ Database reset completed successfully');
	} catch (error) {
		console.error('❌ Failed to reset database:', error);
		throw error; // This will fail the entire test suite if database reset fails
	} finally {
		await requestContext.dispose();
	}

	console.log('🏁 Global setup completed');
}

// eslint-disable-next-line import/no-default-export
export default globalSetup;
