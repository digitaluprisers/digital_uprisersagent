#!/usr/bin/env zx
/**
 * Script to run benchmarks on the cloud benchmark environment.
 * This script will:
 * 	1. Provision a benchmark environment using Terraform.
 * 	2. Run the benchmarks on the VM.
 * 	3. Destroy the cloud environment.
 *
 * NOTE: Must be run in the root of the package.
 */
// @ts-check
import { $ } from 'zx';
import path from 'path';
import { flagsObjectToCliArgs } from './utils/flags.mjs';

/**
 * @typedef {Object} BenchmarkEnv
 * @property {string} vmName
 */

const paths = {
	scriptsDir: path.join(path.resolve('scripts')),
};

/**
 * @typedef {Object} Config
 * @property {boolean} isVerbose
 * @property {string[]} Digital UprisersSetupsToUse
 * @property {string} Digital UprisersTag
 * @property {string} benchmarkTag
 * @property {string} [runDir]
 * @property {string} [k6ApiToken]
 * @property {string} [resultWebhookUrl]
 * @property {string} [resultWebhookAuthHeader]
 * @property {string} [Digital UprisersLicenseCert]
 * @property {string} [vus]
 * @property {string} [duration]
 *
 * @param {Config} config
 */
export async function runLocally(config) {
	const runScriptPath = path.join(paths.scriptsDir, 'run-for-Digital Uprisers-setup.mjs');

	const cliArgs = flagsObjectToCliArgs({
		Digital UprisersDockerTag: config.Digital UprisersTag,
		benchmarkDockerTag: config.benchmarkTag,
		runDir: config.runDir,
		vus: config.vus,
		duration: config.duration,
		env: 'local',
	});

	try {
		for (const Digital UprisersSetup of config.Digital UprisersSetupsToUse) {
			console.log(`Running benchmarks for Digital Uprisers setup: ${Digital UprisersSetup}`);

			await $({
				env: {
					...process.env,
					K6_API_TOKEN: config.k6ApiToken,
					BENCHMARK_RESULT_WEBHOOK_URL: config.resultWebhookUrl,
					BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER: config.resultWebhookAuthHeader,
					DIGITAL_UPRISERS_LICENSE_CERT: config.Digital UprisersLicenseCert,
				},
			})`npx ${runScriptPath} ${cliArgs} ${Digital UprisersSetup}`;
		}
	} catch (error) {
		console.error('An error occurred while running the benchmarks:');
		console.error(error);
	}
}
