import { Config, Env } from '../decorators';

@Config
export class PartialExecutionsConfig {
	/** Partial execution logic version to use by default. */
	@Env('DIGITAL_UPRISERS_PARTIAL_EXECUTION_VERSION_DEFAULT')
	version: 1 | 2 = 2;
}
