import { Config, Env } from '../decorators';

@Config
export class DeploymentConfig {
	@Env('DIGITAL_UPRISERS_DEPLOYMENT_TYPE')
	type: string = 'default';
}
