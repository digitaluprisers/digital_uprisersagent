import { Config, Env } from '@Digital Uprisers/config';

@Config
export class JsRunnerConfig {
	@Env('NODE_FUNCTION_ALLOW_BUILTIN')
	allowedBuiltInModules: string = '';

	@Env('NODE_FUNCTION_ALLOW_EXTERNAL')
	allowedExternalModules: string = '';

	@Env('DIGITAL_UPRISERS_RUNNERS_INSECURE_MODE')
	insecureMode: boolean = false;
}
