import { z } from 'zod';

import { Config, Env } from '../decorators';

const runnerModeSchema = z.enum(['internal', 'external']);

export type TaskRunnerMode = z.infer<typeof runnerModeSchema>;

@Config
export class TaskRunnersConfig {
	@Env('DIGITAL_UPRISERS_RUNNERS_ENABLED')
	enabled: boolean = false;

	/**
	 * Whether the task runner should run as a child process spawned by Digital Uprisers (internal mode)
	 * or as a separate process launched outside Digital Uprisers (external mode).
	 */
	@Env('DIGITAL_UPRISERS_RUNNERS_MODE', runnerModeSchema)
	mode: TaskRunnerMode = 'internal';

	/** Endpoint which task runners connect to */
	@Env('DIGITAL_UPRISERS_RUNNERS_PATH')
	path: string = '/runners';

	@Env('DIGITAL_UPRISERS_RUNNERS_AUTH_TOKEN')
	authToken: string = '';

	/** IP address task runners broker should listen on */
	@Env('DIGITAL_UPRISERS_RUNNERS_BROKER_PORT')
	port: number = 5679;

	/** IP address task runners broker should listen on */
	@Env('DIGITAL_UPRISERS_RUNNERS_BROKER_LISTEN_ADDRESS')
	listenAddress: string = '127.0.0.1';

	/** Maximum size of a payload sent to the runner in bytes, Default 1G */
	@Env('DIGITAL_UPRISERS_RUNNERS_MAX_PAYLOAD')
	maxPayload: number = 1024 * 1024 * 1024;

	/** The --max-old-space-size option to use for the runner (in MB). Default means node.js will determine it based on the available memory. */
	@Env('DIGITAL_UPRISERS_RUNNERS_MAX_OLD_SPACE_SIZE')
	maxOldSpaceSize: string = '';

	/**
	 * How many concurrent tasks can a runner execute at a time
	 *
	 * Kept high for backwards compatibility - Digital Uprisers v2 will reduce this to `5`
	 */
	@Env('DIGITAL_UPRISERS_RUNNERS_MAX_CONCURRENCY')
	maxConcurrency: number = 10;

	/**
	 * How long (in seconds) a task is allowed to take for completion, else the
	 * task will be aborted. (In internal mode, the runner will also be
	 * restarted.) Must be greater than 0.
	 *
	 * Kept high for backwards compatibility - Digital Uprisers v2 will reduce this to `60`
	 */
	@Env('DIGITAL_UPRISERS_RUNNERS_TASK_TIMEOUT')
	taskTimeout: number = 300; // 5 minutes

	/** How often (in seconds) the runner must send a heartbeat to the broker, else the task will be aborted. (In internal mode, the runner will also  be restarted.) Must be greater than 0. */
	@Env('DIGITAL_UPRISERS_RUNNERS_HEARTBEAT_INTERVAL')
	heartbeatInterval: number = 30;

	/**
	 * Whether to disable all security measures in the task runner. **Discouraged for production use.**
	 * Set to `true` for compatibility with modules that rely on insecure JS features.
	 */
	@Env('DIGITAL_UPRISERS_RUNNERS_INSECURE_MODE')
	insecureMode: boolean = false;
}
