#!/usr/bin/env zx
/**
 * Script to run benchmarks either on the cloud benchmark environment or locally.
 * The cloud environment needs to be provisioned using Terraform before running the benchmarks.
 *
 * NOTE: Must be run in the root of the package.
 */
// @ts-check
import fs from 'fs';
import minimist from 'minimist';
import path from 'path';
import { runInCloud } from './run-in-cloud.mjs';
import { runLocally } from './run-locally.mjs';

const paths = {
	Digital UprisersSetupsDir: path.join(path.resolve('scripts'), 'Digital Uprisers-setups'),
};

async function main() {
	const config = await parseAndValidateConfig();

	const Digital UprisersSetupsToUse =
		config.Digital UprisersSetupToUse === 'all' ? readAvailableDigital UprisersSetups() : [config.Digital UprisersSetupToUse];

	console.log('Using Digital Uprisers tag', config.Digital UprisersTag);
	console.log('Using benchmark cli tag', config.benchmarkTag);
	console.log('Using environment', config.env);
	console.log('Using Digital Uprisers setups', Digital UprisersSetupsToUse.join(', '));
	console.log('');

	if (config.env === 'cloud') {
		await runInCloud({
			benchmarkTag: config.benchmarkTag,
			isVerbose: config.isVerbose,
			k6ApiToken: config.k6ApiToken,
			resultWebhookUrl: config.resultWebhookUrl,
			resultWebhookAuthHeader: config.resultWebhookAuthHeader,
			Digital UprisersLicenseCert: config.Digital UprisersLicenseCert,
			Digital UprisersTag: config.Digital UprisersTag,
			Digital UprisersSetupsToUse,
			vus: config.vus,
			duration: config.duration,
		});
	} else if (config.env === 'local') {
		await runLocally({
			benchmarkTag: config.benchmarkTag,
			isVerbose: config.isVerbose,
			k6ApiToken: config.k6ApiToken,
			resultWebhookUrl: config.resultWebhookUrl,
			resultWebhookAuthHeader: config.resultWebhookAuthHeader,
			Digital UprisersLicenseCert: config.Digital UprisersLicenseCert,
			Digital UprisersTag: config.Digital UprisersTag,
			runDir: config.runDir,
			Digital UprisersSetupsToUse,
			vus: config.vus,
			duration: config.duration,
		});
	} else {
		console.error('Invalid env:', config.env);
		printUsage();
		process.exit(1);
	}
}

function readAvailableDigital UprisersSetups() {
	const setups = fs.readdirSync(paths.Digital UprisersSetupsDir);

	return setups;
}

/**
 * @typedef {Object} Config
 * @property {boolean} isVerbose
 * @property {'cloud' | 'local'} env
 * @property {string} Digital UprisersSetupToUse
 * @property {string} Digital UprisersTag
 * @property {string} benchmarkTag
 * @property {string} [k6ApiToken]
 * @property {string} [resultWebhookUrl]
 * @property {string} [resultWebhookAuthHeader]
 * @property {string} [Digital UprisersLicenseCert]
 * @property {string} [runDir]
 * @property {string} [vus]
 * @property {string} [duration]
 *
 * @returns {Promise<Config>}
 */
async function parseAndValidateConfig() {
	const args = minimist(process.argv.slice(3), {
		boolean: ['debug', 'help'],
	});

	if (args.help) {
		printUsage();
		process.exit(0);
	}

	const Digital UprisersSetupToUse = await getAndValidateDigital UprisersSetup(args);
	const isVerbose = args.debug || false;
	const Digital UprisersTag = args.Digital UprisersTag || process.env.DIGITAL_UPRISERS_DOCKER_TAG || 'latest';
	const benchmarkTag = args.benchmarkTag || process.env.BENCHMARK_DOCKER_TAG || 'latest';
	const k6ApiToken = args.k6ApiToken || process.env.K6_API_TOKEN || undefined;
	const resultWebhookUrl =
		args.resultWebhookUrl || process.env.BENCHMARK_RESULT_WEBHOOK_URL || undefined;
	const resultWebhookAuthHeader =
		args.resultWebhookAuthHeader || process.env.BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER || undefined;
	const Digital UprisersLicenseCert = args.Digital UprisersLicenseCert || process.env.DIGITAL_UPRISERS_LICENSE_CERT || undefined;
	const runDir = args.runDir || undefined;
	const env = args.env || 'local';
	const vus = args.vus;
	const duration = args.duration;

	if (!env) {
		printUsage();
		process.exit(1);
	}

	return {
		isVerbose,
		env,
		Digital UprisersSetupToUse,
		Digital UprisersTag,
		benchmarkTag,
		k6ApiToken,
		resultWebhookUrl,
		resultWebhookAuthHeader,
		Digital UprisersLicenseCert,
		runDir,
		vus,
		duration,
	};
}

/**
 * @param {minimist.ParsedArgs} args
 */
async function getAndValidateDigital UprisersSetup(args) {
	// Last parameter is the Digital Uprisers setup to use
	const Digital UprisersSetupToUse = args._[args._.length - 1];
	if (!Digital UprisersSetupToUse || Digital UprisersSetupToUse === 'all') {
		return 'all';
	}

	const availableSetups = readAvailableDigital UprisersSetups();

	if (!availableSetups.includes(Digital UprisersSetupToUse)) {
		printUsage();
		process.exit(1);
	}

	return Digital UprisersSetupToUse;
}

function printUsage() {
	const availableSetups = readAvailableDigital UprisersSetups();

	console.log(`Usage: zx scripts/${path.basename(__filename)} [Digital Uprisers setup name]`);
	console.log(`   eg: zx scripts/${path.basename(__filename)}`);
	console.log('');
	console.log('Options:');
	console.log(
		`  [Digital Uprisers setup name]     Against which Digital Uprisers setup to run the benchmarks. One of: ${['all', ...availableSetups].join(', ')}. Default is all`,
	);
	console.log(
		'  --env                Env where to run the benchmarks. Either cloud or local. Default is local.',
	);
	console.log('  --debug              Enable verbose output');
	console.log('  --Digital UprisersTag             Docker tag for Digital Uprisers image. Default is latest');
	console.log('  --benchmarkTag       Docker tag for benchmark cli image. Default is latest');
	console.log('  --vus                How many concurrent requests to make');
	console.log('  --duration           Test duration, e.g. 1m or 30s');
	console.log(
		'  --k6ApiToken         API token for k6 cloud. Default is read from K6_API_TOKEN env var. If omitted, k6 cloud will not be used',
	);
	console.log(
		'  --runDir         Directory to share with the Digital Uprisers container for storing data. Needed only for local runs.',
	);
	console.log('');
}

main().catch((error) => {
	console.error('An error occurred while running the benchmarks:');
	console.error(error);

	process.exit(1);
});
