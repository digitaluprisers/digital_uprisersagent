#!/usr/bin/env zx
/**
 * This script runs the benchmarks for the given Digital Uprisers setup.
 */
// @ts-check
import path from 'path';
import { $, argv, fs } from 'zx';
import { DockerComposeClient } from './clients/docker-compose-client.mjs';
import { flagsObjectToCliArgs } from './utils/flags.mjs';

const paths = {
	Digital UprisersSetupsDir: path.join(__dirname, 'Digital Uprisers-setups'),
	mockApiDataPath: path.join(__dirname, 'mock-api'),
};

const DIGITAL_UPRISERS_ENCRYPTION_KEY = 'very-secret-encryption-key';

async function main() {
	const [Digital UprisersSetupToUse] = argv._;
	validateDigital UprisersSetup(Digital UprisersSetupToUse);

	const composeFilePath = path.join(paths.Digital UprisersSetupsDir, Digital UprisersSetupToUse);
	const setupScriptPath = path.join(paths.Digital UprisersSetupsDir, Digital UprisersSetupToUse, 'setup.mjs');
	const Digital UprisersTag = argv.Digital UprisersDockerTag || process.env.DIGITAL_UPRISERS_DOCKER_TAG || 'latest';
	const benchmarkTag = argv.benchmarkDockerTag || process.env.BENCHMARK_DOCKER_TAG || 'latest';
	const k6ApiToken = argv.k6ApiToken || process.env.K6_API_TOKEN || undefined;
	const resultWebhookUrl =
		argv.resultWebhookUrl || process.env.BENCHMARK_RESULT_WEBHOOK_URL || undefined;
	const resultWebhookAuthHeader =
		argv.resultWebhookAuthHeader || process.env.BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER || undefined;
	const baseRunDir = argv.runDir || process.env.RUN_DIR || '/Digital Uprisers';
	const Digital UprisersLicenseCert = argv.Digital UprisersLicenseCert || process.env.DIGITAL_UPRISERS_LICENSE_CERT || undefined;
	const Digital UprisersLicenseActivationKey = process.env.DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY || undefined;
	const Digital UprisersLicenseTenantId = argv.Digital UprisersLicenseTenantId || process.env.DIGITAL_UPRISERS_LICENSE_TENANT_ID || '1';
	const envTag = argv.env || 'local';
	const vus = argv.vus;
	const duration = argv.duration;

	const hasDigital UprisersLicense = !!Digital UprisersLicenseCert || !!Digital UprisersLicenseActivationKey;
	if (Digital UprisersSetupToUse === 'scaling-multi-main' && !hasDigital UprisersLicense) {
		console.error(
			'Digital Uprisers license is required to run the multi-main scaling setup. Please provide DIGITAL_UPRISERS_LICENSE_CERT or DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY (and DIGITAL_UPRISERS_LICENSE_TENANT_ID if needed)',
		);
		process.exit(1);
	}

	if (!fs.existsSync(baseRunDir)) {
		console.error(
			`The run directory "${baseRunDir}" does not exist. Please specify a valid directory using --runDir`,
		);
		process.exit(1);
	}

	const runDir = path.join(baseRunDir, Digital UprisersSetupToUse);
	fs.emptyDirSync(runDir);

	const dockerComposeClient = new DockerComposeClient({
		$: $({
			cwd: composeFilePath,
			verbose: true,
			env: {
				PATH: process.env.PATH,
				DIGITAL_UPRISERS_VERSION: Digital UprisersTag,
				DIGITAL_UPRISERS_LICENSE_CERT: Digital UprisersLicenseCert,
				DIGITAL_UPRISERS_LICENSE_ACTIVATION_KEY: Digital UprisersLicenseActivationKey,
				DIGITAL_UPRISERS_LICENSE_TENANT_ID: Digital UprisersLicenseTenantId,
				DIGITAL_UPRISERS_ENCRYPTION_KEY,
				BENCHMARK_VERSION: benchmarkTag,
				K6_API_TOKEN: k6ApiToken,
				BENCHMARK_RESULT_WEBHOOK_URL: resultWebhookUrl,
				BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER: resultWebhookAuthHeader,
				RUN_DIR: runDir,
				MOCK_API_DATA_PATH: paths.mockApiDataPath,
			},
		}),
	});

	// Run the setup script if it exists
	if (fs.existsSync(setupScriptPath)) {
		const setupScript = await import(setupScriptPath);
		await setupScript.setup({ runDir });
	}

	try {
		await dockerComposeClient.$('up', '-d', '--remove-orphans', 'Digital Uprisers');

		const tags = Object.entries({
			Env: envTag,
			Digital UprisersVersion: Digital UprisersTag,
			Digital UprisersSetup: Digital UprisersSetupToUse,
		})
			.map(([key, value]) => `${key}=${value}`)
			.join(',');

		const cliArgs = flagsObjectToCliArgs({
			scenarioNamePrefix: Digital UprisersSetupToUse,
			vus,
			duration,
			tags,
		});

		await dockerComposeClient.$('run', 'benchmark', 'run', ...cliArgs);
	} catch (error) {
		console.error('An error occurred while running the benchmarks:');
		console.error(error.message);
		console.error('');
		await printContainerStatus(dockerComposeClient);
	} finally {
		await dumpLogs(dockerComposeClient);
		await dockerComposeClient.$('down');
	}
}

async function printContainerStatus(dockerComposeClient) {
	console.error('Container statuses:');
	await dockerComposeClient.$('ps', '-a');
}

async function dumpLogs(dockerComposeClient) {
	console.info('Container logs:');
	await dockerComposeClient.$('logs');
}

function printUsage() {
	const availableSetups = getAllDigital UprisersSetups();
	console.log('Usage: zx runForDigital UprisersSetup.mjs --runDir /path/for/Digital Uprisers/data <Digital Uprisers setup to use>');
	console.log(`   eg: zx runForDigital UprisersSetup.mjs --runDir /path/for/Digital Uprisers/data ${availableSetups[0]}`);
	console.log('');
	console.log('Flags:');
	console.log(
		'  --runDir <path>             Directory to share with the Digital Uprisers container for storing data. Default is /Digital Uprisers',
	);
	console.log('  --Digital UprisersDockerTag <tag>        Docker tag for Digital Uprisers image. Default is latest');
	console.log(
		'  --benchmarkDockerTag <tag>  Docker tag for benchmark cli image. Default is latest',
	);
	console.log('  --k6ApiToken <token>        K6 API token to upload the results');
	console.log('');
	console.log('Available setups:');
	console.log(availableSetups.join(', '));
}

/**
 * @returns {string[]}
 */
function getAllDigital UprisersSetups() {
	return fs.readdirSync(paths.Digital UprisersSetupsDir);
}

function validateDigital UprisersSetup(givenSetup) {
	const availableSetups = getAllDigital UprisersSetups();
	if (!availableSetups.includes(givenSetup)) {
		printUsage();
		process.exit(1);
	}
}

main();
